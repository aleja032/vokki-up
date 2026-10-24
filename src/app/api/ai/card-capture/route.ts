import {
  getCardCaptureProvider,
  resolveCardCaptureCredentials
} from '@/domains/ai/server';
import { AiBoundaryError, type AiErrorResponse } from '@/domains/ai/types';
import {
  validateCardCaptureRequest,
  validateAiSelection
} from '@/domains/ai/validation';
import { decryptCredential } from '@/lib/security/ai-credentials';
import {
  createSupabaseServerClient,
  SupabaseConfigurationError
} from '@/lib/supabase/server-client';

export async function POST(request: Request): Promise<Response> {
  try {
    const input = validateCardCaptureRequest(await request.json());
    let authenticated = false;
    let savedCredential: {
      selection: ReturnType<typeof validateAiSelection>;
      apiKey: string;
    } | null = null;
    try {
      const supabase = await createSupabaseServerClient();
      const { data, error } = await supabase.auth.getUser();
      if (error)
        throw new AiBoundaryError(
          'CAPABILITY_UNAVAILABLE',
          'Authentication could not be verified. Try again.',
          503
        );
      if (data.user) {
        authenticated = true;
        const { data: row, error: credentialError } = await supabase
          .from('ai_provider_credentials')
          .select('provider,model,key_ciphertext,key_iv,key_auth_tag')
          .eq('user_id', data.user.id)
          .maybeSingle();
        if (credentialError)
          throw new AiBoundaryError(
            'CAPABILITY_UNAVAILABLE',
            'Saved provider credentials are unavailable.',
            503
          );
        if (row) {
          const selection = validateAiSelection({
            provider: row.provider,
            model: row.model
          });
          const apiKey = decryptCredential({
            ciphertext: row.key_ciphertext,
            iv: row.key_iv,
            authTag: row.key_auth_tag
          });
          savedCredential = { selection, apiKey };
        }
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
    const credentials = resolveCardCaptureCredentials({
      authenticated,
      requestedSelection: input.selection,
      transientApiKey: input.apiKey,
      savedCredential
    });
    const result = await getCardCaptureProvider(
      credentials.selection,
      credentials.apiKey
    ).captureCards(input.input);
    return Response.json(result, {
      headers: { 'Cache-Control': 'private, no-store' }
    });
  } catch (error) {
    return toErrorResponse(error);
  }
}

function toErrorResponse(error: unknown): Response {
  const boundaryError =
    error instanceof AiBoundaryError
      ? error
      : error instanceof SyntaxError
        ? new AiBoundaryError(
            'INVALID_REQUEST',
            'The request body must be valid JSON.',
            400
          )
        : new AiBoundaryError(
            'INTERNAL_ERROR',
            'The capability request could not be completed.',
            500
          );
  const payload: AiErrorResponse = {
    error: { code: boundaryError.code, message: boundaryError.message }
  };
  return Response.json(payload, {
    status: boundaryError.status,
    headers: { 'Cache-Control': 'private, no-store' }
  });
}
