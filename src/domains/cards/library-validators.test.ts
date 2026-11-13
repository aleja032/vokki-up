import { describe, expect, it } from 'vitest';
import { isCardList } from './library-validators';
import {
  isPronunciationLocale,
  normalizePronunciationLocale
} from '@/lib/i18n/locale';

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

  it('uses the same locale length limit for storage validation and fallback', () => {
    const longLocale = 'en-u-ca-gregory-co-phonebk-hc-h23-kf-upper';
    expect(longLocale.length).toBeGreaterThan(35);
    expect(isPronunciationLocale(longLocale)).toBe(false);
    expect(
      isCardList([{ ...legacyCard, pronunciationLocale: longLocale }])
    ).toBe(false);
    expect(normalizePronunciationLocale(longLocale)).toBe('en-US');
  });

  it('rejects locales that expand beyond the storage limit when canonicalized', () => {
    const expandingLocale = 'sh-u-ca-gregory-co-phonebk-hc-h23';
    expect(expandingLocale.length).toBeLessThanOrEqual(35);
    expect(Intl.getCanonicalLocales(expandingLocale)[0].length).toBeGreaterThan(
      35
    );
    expect(isPronunciationLocale(expandingLocale)).toBe(false);
    expect(
      isCardList([{ ...legacyCard, pronunciationLocale: expandingLocale }])
    ).toBe(false);
    expect(normalizePronunciationLocale(expandingLocale)).toBe('en-US');
  });

  it('canonicalizes valid locale values and defaults legacy values safely', () => {
    expect(normalizePronunciationLocale('en-us')).toBe('en-US');
    expect(normalizePronunciationLocale(undefined)).toBe('en-US');
  });
});
