import { NextResponse } from 'next/server';
import {
  encryptCredential,
  maskApiKey,
  validateCredentialInput
} from '@/lib/security/ai-credentials';
import {
  createSupabaseServerClient,
  SupabaseConfigurationError
} from '@/lib/supabase/server-client';

export async function GET() {
  const auth = await getAuthenticatedClient();
  if (auth.response) {
    if (
      auth.response.status === 503 &&
      auth.response.error === 'supabase_not_configured'
    ) {
      return json({ authenticated: false, hasCredential: false }, 200);
    }
    return json({ error: auth.response.error }, auth.response.status);
  }
  if (!auth.user)
    return json({ authenticated: false, hasCredential: false }, 200);
  const { data, error } = await auth.supabase
    .from('ai_provider_credentials')
    .select('provider,model,key_last_four,updated_at')
    .eq('user_id', auth.user.id)
    .maybeSingle();
  if (error) return json({ error: 'credentials_unavailable' }, 503);
  if (!data) return json({ authenticated: true, hasCredential: false }, 200);
  return json(
    {
      authenticated: true,
      hasCredential: true,
      provider: data.provider,
      model: data.model,
      maskedKey: maskApiKey(
        data.key_last_four ? `********${data.key_last_four}` : '********'
      ),
      updatedAt: data.updated_at
    },
    200
  );
}

export async function POST(request: Request) {
  let input: ReturnType<typeof validateCredentialInput>;
  try {
    input = validateCredentialInput(await request.json());
  } catch {
    return json({ error: 'invalid_credential' }, 400);
  }
  const auth = await getAuthenticatedClient();
  if (auth.response)
    return json({ error: auth.response.error }, auth.response.status);
  if (!auth.user) return json({ error: 'authentication_required' }, 401);

  let encrypted: ReturnType<typeof encryptCredential>;
  try {
    encrypted = encryptCredential(input.apiKey);
  } catch {
    return json({ error: 'credential_encryption_unavailable' }, 503);
  }
  const { error } = await auth.supabase.from('ai_provider_credentials').upsert(
    {
      ['user_id']: auth.user.id,
      provider: input.provider,
      model: input.model,
      ['key_ciphertext']: encrypted.ciphertext,
      ['key_iv']: encrypted.iv,
      ['key_auth_tag']: encrypted.authTag,
      ['key_last_four']: input.apiKey.slice(-4),
      ['updated_at']: new Date().toISOString()
    },
    { onConflict: 'user_id' }
  );
  if (error) return json({ error: 'credential_save_failed' }, 503);
  return json(
    {
      authenticated: true,
      hasCredential: true,
      provider: input.provider,
      model: input.model,
      maskedKey: maskApiKey(input.apiKey)
    },
    200
  );
}

export async function DELETE() {
  const auth = await getAuthenticatedClient();
  if (auth.response)
    return json({ error: auth.response.error }, auth.response.status);
  if (!auth.user) return json({ error: 'authentication_required' }, 401);
  const { error } = await auth.supabase
    .from('ai_provider_credentials')
    .delete()
    .eq('user_id', auth.user.id);
  if (error) return json({ error: 'credential_delete_failed' }, 503);
  return json({ authenticated: true, hasCredential: false }, 200);
}

async function getAuthenticatedClient() {
  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.auth.getUser();
    if (error)
      return {
        response: { error: 'authentication_unavailable', status: 503 } as const
      };
    return { supabase, user: data.user };
  } catch (error) {
    if (error instanceof SupabaseConfigurationError) {
      return {
        response: { error: 'supabase_not_configured', status: 503 } as const
      };
    }
    return {
      response: { error: 'authentication_unavailable', status: 503 } as const
    };
  }
}

function json(value: unknown, status: number) {
  return NextResponse.json(value, {
    status,
    headers: { 'Cache-Control': 'private, no-store' }
  });
}
