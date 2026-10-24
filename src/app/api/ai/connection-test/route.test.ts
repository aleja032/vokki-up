import { afterEach, describe, expect, it, vi } from 'vitest';
import { POST } from './route';

const mocks = vi.hoisted(() => ({
  getUser: vi.fn(),
  maybeSingle: vi.fn(),
  fetch: vi.fn<typeof fetch>()
}));

vi.mock('../../../../lib/supabase/server-client', () => ({
  createSupabaseServerClient: vi.fn(async () => ({
    auth: { getUser: mocks.getUser },
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({ maybeSingle: mocks.maybeSingle }))
      }))
    }))
  })),
  SupabaseConfigurationError: class SupabaseConfigurationError extends Error {}
}));

vi.mock('../../../../lib/security/ai-credentials', () => ({
  decryptCredential: vi.fn(() => 'server-saved-api-key-1234567890')
}));

describe('POST /api/ai/connection-test', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    mocks.fetch.mockReset();
  });

  it('tests the saved credential for authenticated users and never returns it', async () => {
    mocks.getUser.mockResolvedValue({
      data: { user: { id: 'user-1' } },
      error: null
    });
    mocks.maybeSingle.mockResolvedValue({
      data: {
        provider: 'gemini',
        model: 'gemini-3.1-flash-lite',
        ['key_ciphertext']: 'ciphertext',
        ['key_iv']: 'iv',
        ['key_auth_tag']: 'tag'
      },
      error: null
    });
    mocks.fetch.mockResolvedValue(new Response('{}', { status: 200 }));
    vi.stubGlobal('fetch', mocks.fetch);

    const response = await POST(
      new Request('http://localhost/api/ai/connection-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          selection: { provider: 'gemini', model: 'gemini-2.5-flash' },
          apiKey: 'client-supplied-key-should-not-be-used'
        })
      })
    );
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(mocks.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/gemini-2.5-flash:generateContent'),
      expect.objectContaining({
        headers: expect.objectContaining({
          'x-goog-api-key': 'server-saved-api-key-1234567890'
        })
      })
    );
    expect(JSON.stringify(payload)).not.toContain(
      'server-saved-api-key-1234567890'
    );
    expect(JSON.stringify(payload)).not.toContain(
      'client-supplied-key-should-not-be-used'
    );
    expect(payload).toMatchObject({ success: true });
  });

  it('returns an actionable unsupported-provider error instead of success', async () => {
    const response = await POST(
      new Request('http://localhost/api/ai/connection-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          selection: { provider: 'openai', model: 'gpt-4o-mini' }
        })
      })
    );
    const payload = await response.json();

    expect(response.status).toBe(501);
    expect(payload.error.message).toMatch(/not available yet/i);
    expect(mocks.getUser).not.toHaveBeenCalled();
  });
});
