import { describe, expect, it } from 'vitest';
import {
  AI_USE_CARDS_STORAGE_KEY,
  getAiAvailability,
  isAiForCardsValue
} from './ai-for-cards.util';

describe('AI_USE_CARDS_STORAGE_KEY', () => {
  it('keeps the key the settings screen has always written', () => {
    expect(AI_USE_CARDS_STORAGE_KEY).toBe('settings/ai-use-cards');
  });
});

describe('isAiForCardsValue', () => {
  it('accepts only booleans', () => {
    expect(isAiForCardsValue(true)).toBe(true);
    expect(isAiForCardsValue(false)).toBe(true);
    expect(isAiForCardsValue('true')).toBe(false);
    expect(isAiForCardsValue(1)).toBe(false);
    expect(isAiForCardsValue(null)).toBe(false);
    expect(isAiForCardsValue(undefined)).toBe(false);
  });
});

describe('getAiAvailability', () => {
  it('reports loading until the stored value is read', () => {
    expect(getAiAvailability({ isEnabled: true, isLoaded: false })).toBe(
      'loading'
    );
    expect(getAiAvailability({ isEnabled: false, isLoaded: false })).toBe(
      'loading'
    );
  });

  it('reports enabled or disabled once loaded', () => {
    expect(getAiAvailability({ isEnabled: true, isLoaded: true })).toBe(
      'enabled'
    );
    expect(getAiAvailability({ isEnabled: false, isLoaded: true })).toBe(
      'disabled'
    );
  });
});
