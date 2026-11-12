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

  const guest = {
    data: { user: null },
    error: { name: 'AuthSessionMissingError', message: 'Auth session missing!' }
  };

  function post(body: unknown) {
    return POST(
      new Request('http://localhost/api/ai/connection-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })
    );
  }

  it('tests OpenAI with the saved credential for authenticated users', async () => {
    mocks.getUser.mockResolvedValue({
      data: { user: { id: 'user-1' } },
      error: null
    });
    mocks.maybeSingle.mockResolvedValue({
      data: {
        provider: 'openai',
        ['key_ciphertext']: 'c',
        ['key_iv']: 'i',
        ['key_auth_tag']: 't'
      },
      error: null
    });
    mocks.fetch.mockResolvedValue(new Response('{}', { status: 200 }));
    vi.stubGlobal('fetch', mocks.fetch);
    const response = await post({
      selection: { provider: 'openai', model: 'gpt-4o-mini' }
    });
    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({ success: true });
    expect(mocks.fetch).toHaveBeenCalledWith(
      'https://api.openai.com/v1/models/gpt-4o-mini',
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Bearer server-saved-api-key-1234567890'
        })
      })
    );
  });

  it('maps OpenAI 401, 429 and network failures', async () => {
    mocks.getUser.mockResolvedValue(guest);
    vi.stubGlobal('fetch', mocks.fetch);
    const body = {
      selection: { provider: 'openai', model: 'gpt-4o' },
      apiKey: 'sk-transient-key-1234567890'
    };
    mocks.fetch.mockResolvedValueOnce(new Response('{}', { status: 401 }));
    expect((await post(body)).status).toBe(502);
    mocks.fetch.mockResolvedValueOnce(new Response('{}', { status: 429 }));
    expect((await post(body)).status).toBe(429);
    mocks.fetch.mockRejectedValueOnce(new TypeError('network'));
    const failed = await post(body);
    expect(failed.status).toBe(502);
    expect(JSON.stringify(await failed.json())).not.toContain(
      'sk-transient-key'
    );
  });

  it('lets guests test Gemini and OpenAI with a transient key', async () => {
    mocks.getUser.mockResolvedValue(guest);
    mocks.fetch.mockResolvedValue(new Response('{}', { status: 200 }));
    vi.stubGlobal('fetch', mocks.fetch);
    const gemini = await post({
      selection: { provider: 'gemini', model: 'gemini-2.5-flash' },
      apiKey: 'AIzaTransientKey1234567890'
    });
    expect(gemini.status).toBe(200);
    const openai = await post({
      selection: { provider: 'openai', model: 'gpt-4o' },
      apiKey: 'sk-transient-key-1234567890'
    });
    expect(openai.status).toBe(200);
    expect(mocks.fetch).toHaveBeenCalledTimes(2);
  });

  it('asks guests without a key to enter one', async () => {
    mocks.getUser.mockResolvedValue(guest);
    const response = await post({
      selection: { provider: 'openai', model: 'gpt-4o' }
    });
    expect(response.status).toBe(401);
  });

  it('keeps INVALID_SELECTION when the saved provider differs', async () => {
    mocks.getUser.mockResolvedValue({
      data: { user: { id: 'user-1' } },
      error: null
    });
    mocks.maybeSingle.mockResolvedValue({
      data: {
        provider: 'gemini',
        ['key_ciphertext']: 'c',
        ['key_iv']: 'i',
        ['key_auth_tag']: 't'
      },
      error: null
    });
    const response = await post({
      selection: { provider: 'openai', model: 'gpt-4o' }
    });
    expect(response.status).toBe(400);
    expect((await response.json()).error.code).toBe('INVALID_SELECTION');
  });
});
