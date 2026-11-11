import { describe, expect, it } from 'vitest';
import {
  LOCALE_COOKIE,
  isLocale,
  languageToLocale,
  localeToLanguage,
  readLocaleFromCookieString
} from './locale-cookie';

describe('locale cookie helpers', () => {
  it('maps languages to locales and back', () => {
    expect(LOCALE_COOKIE).toBe('vokki-locale');
    expect(languageToLocale('Español')).toBe('es');
    expect(languageToLocale('English')).toBe('en');
    expect(localeToLanguage('es')).toBe('Español');
    expect(localeToLanguage('en')).toBe('English');
  });

  it('validates locale codes', () => {
    expect(isLocale('en')).toBe(true);
    expect(isLocale('es')).toBe(true);
    expect(isLocale('fr')).toBe(false);
    expect(isLocale(undefined)).toBe(false);
  });

  it('reads the locale from a cookie string', () => {
    expect(readLocaleFromCookieString('a=1; vokki-locale=en; b=2')).toBe('en');
    expect(readLocaleFromCookieString('vokki-locale=xx')).toBeNull();
    expect(readLocaleFromCookieString('')).toBeNull();
  });
});
