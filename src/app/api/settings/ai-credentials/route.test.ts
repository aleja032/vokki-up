import { beforeEach, describe, expect, it, vi } from 'vitest';
import { DELETE, GET, PATCH, POST } from './route';

const mocks = vi.hoisted(() => ({
  getUser: vi.fn(),
  maybeSingle: vi.fn(),
  updateEq: vi.fn(),
  update: vi.fn(),
  upsert: vi.fn()
}));

vi.mock('@/lib/supabase/server-client', () => ({
  createSupabaseServerClient: vi.fn(async () => ({
    auth: { getUser: mocks.getUser },
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({ maybeSingle: mocks.maybeSingle }))
      })),
      update: mocks.update,
      upsert: mocks.upsert,
      delete: vi.fn(() => ({ eq: vi.fn(async () => ({ error: null })) }))
    }))
  })),
  SupabaseConfigurationError: class SupabaseConfigurationError extends Error {}
}));

const missingSession = {
  data: { user: null },
  error: { name: 'AuthSessionMissingError', message: 'Auth session missing!' }
};
const signedIn = { data: { user: { id: 'user-1' } }, error: null };
const row = {
  provider: 'gemini',
  model: 'gemini-3.1-flash-lite',
  ['key_last_four']: '1234',
  ['updated_at']: '2026-01-01T00:00:00.000Z'
};

function request(method: string, body?: unknown) {
  return new Request('http://localhost/api/settings/ai-credentials', {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body)
  });
}

describe('/api/settings/ai-credentials', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    mocks.updateEq.mockResolvedValue({ error: null });
    mocks.update.mockReturnValue({ eq: mocks.updateEq });
    mocks.upsert.mockResolvedValue({ error: null });
  });

  it('GET returns the guest payload when the session is missing', async () => {
    mocks.getUser.mockResolvedValue(missingSession);
    const response = await GET();
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
      authenticated: false,
      hasCredential: false
    });
  });

  it('GET keeps other auth errors as 503', async () => {
    mocks.getUser.mockResolvedValue({
      data: { user: null },
      error: { name: 'AuthRetryableFetchError', message: 'down', status: 500 }
    });
    const response = await GET();
    expect(response.status).toBe(503);
    expect(await response.json()).toEqual({ error: 'authentication_unavailable' });
  });

  it('GET reports a signed-in user with and without a credential', async () => {
    mocks.getUser.mockResolvedValue(signedIn);
    mocks.maybeSingle.mockResolvedValueOnce({ data: null, error: null });
    expect(await (await GET()).json()).toEqual({
      authenticated: true,
      hasCredential: false
    });
    mocks.maybeSingle.mockResolvedValueOnce({ data: row, error: null });
    const payload = await (await GET()).json();
    expect(payload).toMatchObject({
      authenticated: true,
      hasCredential: true,
      provider: 'gemini',
      model: 'gemini-3.1-flash-lite',
      maskedKey: '••••1234'
    });
  });

  it('POST, PATCH and DELETE answer 401 for guests', async () => {
    mocks.getUser.mockResolvedValue(missingSession);
    const post = await POST(
      request('POST', {
        provider: 'gemini',
        model: 'gemini-2.5-flash',
        apiKey: 'AIzaSyVerySecret1234567890'
      })
    );
    expect(post.status).toBe(401);
    expect(await post.json()).toEqual({ error: 'authentication_required' });
    const patch = await PATCH(
      request('PATCH', { provider: 'gemini', model: 'gemini-2.5-flash' })
    );
    expect(patch.status).toBe(401);
    expect(await patch.json()).toEqual({ error: 'authentication_required' });
    const del = await DELETE();
    expect(del.status).toBe(401);
    expect(await del.json()).toEqual({ error: 'authentication_required' });
  });

  it('PATCH updates the model for the stored provider without touching the key', async () => {
    mocks.getUser.mockResolvedValue(signedIn);
    mocks.maybeSingle.mockResolvedValue({ data: row, error: null });
    const response = await PATCH(
      request('PATCH', { provider: 'gemini', model: 'gemini-2.5-pro' })
    );
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
      authenticated: true,
      hasCredential: true,
      provider: 'gemini',
      model: 'gemini-2.5-pro',
      maskedKey: '••••1234'
    });
    const patch = mocks.update.mock.calls[0][0] as Record<string, unknown>;
    expect(patch).toMatchObject({
      provider: 'gemini',
      model: 'gemini-2.5-pro'
    });
    expect(patch['updated_at']).toEqual(expect.any(String));
    expect(Object.keys(patch).some(key => key.startsWith('key_'))).toBe(false);
  });

  it('PATCH answers 409 when the provider differs from the stored one', async () => {
    mocks.getUser.mockResolvedValue(signedIn);
    mocks.maybeSingle.mockResolvedValue({ data: row, error: null });
    const response = await PATCH(
      request('PATCH', { provider: 'openai', model: 'gpt-4o' })
    );
    expect(response.status).toBe(409);
    expect(await response.json()).toEqual({ error: 'provider_mismatch' });
    expect(mocks.update).not.toHaveBeenCalled();
  });

  it('PATCH answers 404 when the user has no credential', async () => {
    mocks.getUser.mockResolvedValue(signedIn);
    mocks.maybeSingle.mockResolvedValue({ data: null, error: null });
    const response = await PATCH(
      request('PATCH', { provider: 'gemini', model: 'gemini-2.5-pro' })
    );
    expect(response.status).toBe(404);
    expect(await response.json()).toEqual({ error: 'no_credential' });
  });

  it('PATCH answers 400 for an invalid body', async () => {
    mocks.getUser.mockResolvedValue(signedIn);
    for (const body of [
      { provider: 'gemini', model: 'gpt-4o' },
      { provider: 'gemini' },
      { provider: 'gemini', model: 'gemini-2.5-pro', apiKey: 'x'.repeat(30) }
    ]) {
      const response = await PATCH(request('PATCH', body));
      expect(response.status).toBe(400);
      expect(await response.json()).toEqual({ error: 'invalid_selection' });
    }
  });
});
