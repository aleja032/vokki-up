import { describe, expect, it } from 'vitest';
import { resolveCardCaptureCredentials } from './server';

describe('resolveCardCaptureCredentials', () => {
  const requested = { provider: 'openai', model: 'gpt-4o-mini' } as const;

  it('uses saved provider credentials for authenticated users, ignoring transient request keys', () => {
    expect(
      resolveCardCaptureCredentials({
        authenticated: true,
        requestedSelection: requested,
        transientApiKey: 'untrusted-browser-key',
        savedCredential: {
          selection: { provider: 'gemini', model: 'gemini-2.5-flash' },
          apiKey: 'saved-secret'
        }
      })
    ).toEqual({
      selection: { provider: 'gemini', model: 'gemini-2.5-flash' },
      apiKey: 'saved-secret'
    });
  });

  it('rejects authenticated requests without a saved credential', () => {
    expect(() =>
      resolveCardCaptureCredentials({
        authenticated: true,
        requestedSelection: requested,
        transientApiKey: 'browser-key',
        savedCredential: null
      })
    ).toThrow('Save a provider credential');
  });

  it('allows only transient keys for anonymous requests and rejects missing keys', () => {
    expect(
      resolveCardCaptureCredentials({
        authenticated: false,
        requestedSelection: requested,
        transientApiKey: 'anonymous-secret',
        savedCredential: null
      })
    ).toEqual({ selection: requested, apiKey: 'anonymous-secret' });
    expect(() =>
      resolveCardCaptureCredentials({
        authenticated: false,
        requestedSelection: requested,
        transientApiKey: undefined,
        savedCredential: null
      })
    ).toThrow('temporary API key');
  });
});
