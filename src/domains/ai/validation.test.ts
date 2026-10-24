import { describe, expect, it } from 'vitest';
import { validateAiSelection } from './validation';

describe('validateAiSelection', () => {
  it('accepts a model listed for its provider', () => {
    expect(
      validateAiSelection({ provider: 'gemini', model: 'gemini-2.5-flash' })
    ).toEqual({ provider: 'gemini', model: 'gemini-2.5-flash' });
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
