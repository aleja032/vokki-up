import { describe, expect, it, vi } from 'vitest';
import { testOpenAiConnection } from './openai-connection-test';

describe('testOpenAiConnection', () => {
  it('checks the selected model with a bearer key', async () => {
    const fetchImplementation = vi.fn<typeof fetch>(
      async () => new Response('{}', { status: 200 })
    );
    await testOpenAiConnection({
      apiKey: 'sk-test-key-12345678901234',
      model: 'gpt-4o-mini',
      fetchImplementation
    });
    expect(fetchImplementation).toHaveBeenCalledWith(
      'https://api.openai.com/v1/models/gpt-4o-mini',
      expect.objectContaining({
        method: 'GET',
        headers: expect.objectContaining({
          Authorization: 'Bearer sk-test-key-12345678901234'
        })
      })
    );
  });

  it('maps rejected keys, rate limits and other failures', async () => {
    const run = (status: number) =>
      testOpenAiConnection({
        apiKey: 'sk-test-key-12345678901234',
        model: 'gpt-4o',
        fetchImplementation: async () => new Response('{}', { status })
      });
    await expect(run(401)).rejects.toMatchObject({ status: 502 });
    await expect(run(403)).rejects.toMatchObject({ status: 502 });
    await expect(run(429)).rejects.toMatchObject({ status: 429 });
    await expect(run(500)).rejects.toMatchObject({ status: 502 });
  });

  it('maps timeouts and network failures without leaking the key', async () => {
    await expect(
      testOpenAiConnection({
        apiKey: 'sk-test-key-12345678901234',
        model: 'gpt-4o',
        fetchImplementation: async () => {
          throw new DOMException('timeout', 'TimeoutError');
        }
      })
    ).rejects.toMatchObject({ status: 504 });
    const failure = await testOpenAiConnection({
      apiKey: 'sk-test-key-12345678901234',
      model: 'gpt-4o',
      fetchImplementation: async () => {
        throw new TypeError('network');
      }
    }).catch((error: Error) => error);
    expect(failure).toMatchObject({ status: 502 });
    expect((failure as Error).message).not.toContain('sk-test-key');
  });
});
