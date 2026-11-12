import { describe, expect, it } from 'vitest';
import { isCardList } from './library-validators';

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

describe('card pronunciation locale validation', () => {
  it('keeps legacy cards valid when locale is absent', () => {
    expect(isCardList([legacyCard])).toBe(true);
  });

  it('accepts well-formed BCP 47 locales and rejects malformed ones', () => {
    expect(isCardList([{ ...legacyCard, pronunciationLocale: 'es-MX' }])).toBe(
      true
    );
    expect(
      isCardList([{ ...legacyCard, pronunciationLocale: 'not a locale' }])
    ).toBe(false);
  });
});
