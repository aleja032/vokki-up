import { describe, expect, it } from 'vitest';
import { AI_PROVIDER_CATALOG, DEFAULT_AI_SELECTION } from './catalog';

describe('AI provider catalog', () => {
  it('offers the supported Gemini models and selects Flash Lite by default', () => {
    const gemini = AI_PROVIDER_CATALOG.find(
      provider => provider.id === 'gemini'
    );

    expect(gemini?.models).toEqual([
      'gemini-3.1-flash-lite',
      'gemini-2.5-flash',
      'gemini-2.5-pro'
    ]);
    expect(DEFAULT_AI_SELECTION).toEqual({
      provider: 'gemini',
      model: 'gemini-3.1-flash-lite'
    });
  });
});
