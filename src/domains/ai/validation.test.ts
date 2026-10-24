import { describe, expect, it } from 'vitest';
import { validateAiSelection, validateCardCaptureRequest } from './validation';

describe('validateAiSelection', () => {
  it('accepts a model listed for its provider', () => {
    expect(
      validateAiSelection({ provider: 'gemini', model: 'gemini-2.5-flash' })
    ).toEqual({ provider: 'gemini', model: 'gemini-2.5-flash' });
  });

  it('rejects Gemini models removed from the supported catalog', () => {
    expect(() =>
      validateAiSelection({
        provider: 'gemini',
        model: 'gemini-3.5-flash-lite'
      })
    ).toThrow('not available for provider');
  });
  it('rejects a model that belongs to a different provider', () => {
    expect(() =>
      validateAiSelection({ provider: 'gemini', model: 'gpt-4o-mini' })
    ).toThrow('not available for provider');
  });

  it('rejects unknown providers', () => {
    expect(() =>
      validateAiSelection({ provider: 'unknown', model: 'unknown' })
    ).toThrow('Unsupported AI provider');
  });

  it('rejects credential fields instead of accepting browser-supplied secrets', () => {
    expect(() =>
      validateAiSelection({
        provider: 'gemini',
        model: 'gemini-2.5-flash',
        apiKey: 'secret'
      })
    ).toThrow('Choose a supported provider and model');
  });
});

describe('validateCardCaptureRequest guest credential handling', () => {
  it('accepts a transient key only as an optional in-memory request field', () => {
    expect(
      validateCardCaptureRequest({
        selection: { provider: 'gemini', model: 'gemini-3.1-flash-lite' },
        apiKey: 'AIzaSyVerySecret1234567890',
        input: { kind: 'text', text: 'reliable' }
      }).apiKey
    ).toBe('AIzaSyVerySecret1234567890');
  });
  it('rejects empty or malformed transient keys', () => {
    expect(() =>
      validateCardCaptureRequest({
        selection: { provider: 'gemini', model: 'gemini-3.1-flash-lite' },
        apiKey: 'short',
        input: { kind: 'text', text: 'reliable' }
      })
    ).toThrow();
  });
});
