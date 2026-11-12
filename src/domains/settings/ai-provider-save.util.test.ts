import { describe, expect, it } from 'vitest';
import { resolveProviderSaveAction } from './ai-provider-save.util';

const base = {
  isAuthenticated: true,
  typedKey: '',
  savedCredential: { provider: 'gemini', model: 'gemini-2.5-flash' },
  selectedProvider: 'gemini',
  selectedModel: 'gemini-2.5-flash'
} as const;

describe('resolveProviderSaveAction', () => {
  it('posts the selection with the key when a key was typed', () => {
    expect(
      resolveProviderSaveAction({ ...base, typedKey: '  secret-key  ' })
    ).toEqual({
      kind: 'post',
      provider: 'gemini',
      model: 'gemini-2.5-flash',
      apiKey: 'secret-key'
    });
  });

  it('posts when a key was typed and there is no saved credential yet', () => {
    expect(
      resolveProviderSaveAction({
        ...base,
        typedKey: 'secret-key',
        savedCredential: null
      }).kind
    ).toBe('post');
  });

  it('posts when a key was typed for a different provider', () => {
    expect(
      resolveProviderSaveAction({
        ...base,
        typedKey: 'secret-key',
        selectedProvider: 'openai',
        selectedModel: 'gpt-4.1-mini'
      })
    ).toEqual({
      kind: 'post',
      provider: 'openai',
      model: 'gpt-4.1-mini',
      apiKey: 'secret-key'
    });
  });

  it('patches when only the model changed for the same provider', () => {
    expect(
      resolveProviderSaveAction({ ...base, selectedModel: 'gemini-2.5-pro' })
    ).toEqual({ kind: 'patch', provider: 'gemini', model: 'gemini-2.5-pro' });
  });

  it('asks for a key when the saved credential is for another provider', () => {
    expect(
      resolveProviderSaveAction({
        ...base,
        selectedProvider: 'openai',
        selectedModel: 'gpt-4.1-mini'
      })
    ).toEqual({ kind: 'needs-key-for-provider' });
  });

  it('does nothing when the selection matches the saved credential', () => {
    expect(resolveProviderSaveAction(base)).toEqual({ kind: 'none' });
  });

  it('does nothing when authenticated without saved credential or key', () => {
    expect(
      resolveProviderSaveAction({ ...base, savedCredential: null })
    ).toEqual({ kind: 'none' });
  });

  it('treats a whitespace-only key as not typed', () => {
    expect(resolveProviderSaveAction({ ...base, typedKey: '   ' })).toEqual({
      kind: 'none'
    });
  });

  it('keeps guests transient when a key was typed', () => {
    expect(
      resolveProviderSaveAction({
        ...base,
        isAuthenticated: false,
        savedCredential: null,
        typedKey: ' guest-key '
      })
    ).toEqual({ kind: 'transient', apiKey: 'guest-key' });
  });

  it('does nothing for guests without a typed key', () => {
    expect(
      resolveProviderSaveAction({
        ...base,
        isAuthenticated: false,
        savedCredential: null,
        selectedModel: 'gemini-2.5-pro'
      })
    ).toEqual({ kind: 'none' });
  });
});
