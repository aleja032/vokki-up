import { describe, expect, it } from 'vitest';
import { hasPendingChanges } from './pending-changes.util';

const idle = {
  isLanguageDirty: false,
  typedKey: '',
  isAuthenticated: true,
  savedCredential: { provider: 'gemini', model: 'gemini-2.5-flash' },
  selectedProvider: 'gemini',
  selectedModel: 'gemini-2.5-flash'
} as const;

describe('hasPendingChanges', () => {
  it('is false when nothing differs', () => {
    expect(hasPendingChanges(idle)).toBe(false);
  });

  it('is true when the language draft differs', () => {
    expect(hasPendingChanges({ ...idle, isLanguageDirty: true })).toBe(true);
  });

  it('is true when a key was typed', () => {
    expect(hasPendingChanges({ ...idle, typedKey: 'abc' })).toBe(true);
  });

  it('ignores a whitespace-only key', () => {
    expect(hasPendingChanges({ ...idle, typedKey: '   ' })).toBe(false);
  });

  it('is true when the model differs from the saved selection', () => {
    expect(hasPendingChanges({ ...idle, selectedModel: 'gemini-2.5-pro' })).toBe(
      true
    );
  });

  it('is true when the provider differs from the saved selection', () => {
    expect(
      hasPendingChanges({
        ...idle,
        selectedProvider: 'openai',
        selectedModel: 'gpt-4.1-mini'
      })
    ).toBe(true);
  });

  it('is false when authenticated without a saved credential', () => {
    expect(
      hasPendingChanges({
        ...idle,
        savedCredential: null,
        selectedModel: 'gemini-2.5-pro'
      })
    ).toBe(false);
  });

  it('ignores the saved selection for guests', () => {
    expect(
      hasPendingChanges({
        ...idle,
        isAuthenticated: false,
        selectedModel: 'gemini-2.5-pro'
      })
    ).toBe(false);
  });
});
