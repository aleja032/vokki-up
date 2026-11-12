import { describe, expect, it } from 'vitest';
import { isVocabularyCardList } from './validators';

const legacyCard = {
  id: 'card-1',
  term: 'hello',
  meaning: 'hola',
  phonetics: '',
  example: '',
  partOfSpeech: 'Sustantivo',
  groupId: '',
  tags: []
};

describe('review card pronunciation locale validation', () => {
  it('accepts legacy cards and validates configured locale tags', () => {
    expect(isVocabularyCardList([legacyCard])).toBe(true);
    expect(
      isVocabularyCardList([{ ...legacyCard, pronunciationLocale: 'en-GB' }])
    ).toBe(true);
    expect(
      isVocabularyCardList([
        { ...legacyCard, pronunciationLocale: 'invalid_tag' }
      ])
    ).toBe(false);
  });
});
