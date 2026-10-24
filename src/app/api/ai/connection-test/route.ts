import { NextResponse } from 'next/server';
import { testGeminiConnection } from '../../../../domains/ai/gemini-card-capture-provider';
import { AiBoundaryError } from '../../../../domains/ai/types';
import { validateAiSelection } from '../../../../domains/ai/validation';
import { decryptCredential } from '../../../../lib/security/ai-credentials';
import {
  createSupabaseServerClient,
  SupabaseConfigurationError
} from '../../../../lib/supabase/server-client';

export async function POST(request: Request): Promise<Response> {
  const startedAt = performance.now();
  try {
    const body: unknown = await request.json();
    if (!isRecord(body) || !hasOnlyKeys(body, ['selection', 'apiKey'])) {
      throw invalidRequest();
    }
    const selection = validateAiSelection(body.selection);
    if (selection.provider !== 'gemini') {
      throw new AiBoundaryError(
        'CAPABILITY_UNAVAILABLE',
        `Connection testing for ${selection.provider} is not available yet. Choose Gemini to test a provider connection.`,
        501
      );
    }
    if (
      body.apiKey !== undefined &&
      (typeof body.apiKey !== 'string' ||
        body.apiKey.trim().length < 20 ||
        body.apiKey.length > 4096 ||
        /[\r\n\0]/.test(body.apiKey))
    ) {
      throw invalidRequest();
    }

    const credential = await resolveConnectionCredential({
      selection,
      transientApiKey:
        typeof body.apiKey === 'string' ? body.apiKey.trim() : undefined
    });

    await testGeminiConnection({
      apiKey: credential.apiKey,
      model: selection.model
    });
    return json(
      {
        success: true,
        latencyMs: Math.max(0, Math.round(performance.now() - startedAt))
      },
      200
    );
  } catch (error) {
    return toErrorResponse(
      error,
      Math.max(0, Math.round(performance.now() - startedAt))
    );
  }
}

async function resolveConnectionCredential(input: {
  selection: ReturnType<typeof validateAiSelection>;
  transientApiKey?: string;
}): Promise<{ apiKey: string }> {
  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.auth.getUser();
    if (error) {
      throw new AiBoundaryError(
        'CAPABILITY_UNAVAILABLE',
        'Authentication could not be verified. Try again.',
        503
      );
    }
    if (data.user) {
      const { data: row, error: credentialError } = await supabase
        .from('ai_provider_credentials')
        .select('provider,key_ciphertext,key_iv,key_auth_tag')
        .eq('user_id', data.user.id)
        .maybeSingle();
      if (credentialError) {
        throw new AiBoundaryError(
          'CAPABILITY_UNAVAILABLE',
          'Saved provider credentials are unavailable. Try again later.',
          503
        );
      }
      if (!row) {
        throw new AiBoundaryError(
          'AUTH_REQUIRED',
          'Save an API key for the selected provider before testing the connection.',
          401
        );
      }
      if (row.provider !== input.selection.provider) {
        throw new AiBoundaryError(
          'INVALID_SELECTION',
          'The saved API key belongs to a different provider. Save a key for the selected provider before testing.',
          400
        );
      }
      return {
        apiKey: decryptCredential({
          ciphertext: row.key_ciphertext,
          iv: row.key_iv,
          authTag: row.key_auth_tag
        })
      };
    }
  } catch (error) {
    if (error instanceof AiBoundaryError) throw error;
    if (!(error instanceof SupabaseConfigurationError)) {
      throw new AiBoundaryError(
        'CAPABILITY_UNAVAILABLE',
        'Authentication could not be verified. Try again.',
        503
      );
    }
  }

  if (!input.transientApiKey) {
    throw new AiBoundaryError(
      'AUTH_REQUIRED',
      'Enter a temporary API key in settings to test the connection while signed out.',
      401
    );
  }
  return { apiKey: input.transientApiKey };
}

function toErrorResponse(error: unknown, latencyMs: number): Response {
  const boundaryError =
    error instanceof AiBoundaryError
      ? error
      : error instanceof SyntaxError
        ? invalidRequest()
        : new AiBoundaryError(
            'INTERNAL_ERROR',
            'The connection test could not be completed.',
            500
          );
  return json(
    {
      error: { code: boundaryError.code, message: boundaryError.message },
      latencyMs
    },
    boundaryError.status
  );
}

function invalidRequest(): AiBoundaryError {
  return new AiBoundaryError(
    'INVALID_REQUEST',
    'Choose a supported provider and model, then try again.',
    400
  );
}

function json(value: unknown, status: number) {
  return NextResponse.json(value, {
    status,
    headers: { 'Cache-Control': 'private, no-store' }
  });
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function hasOnlyKeys(value: Record<string, unknown>, keys: string[]) {
  return Object.keys(value).every(key => keys.includes(key));
}
