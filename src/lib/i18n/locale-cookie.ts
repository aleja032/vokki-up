import type { AppLanguage } from './locale';

export type Locale = 'es' | 'en';

export const LOCALE_COOKIE = 'vokki-locale';
export const DEFAULT_LOCALE: Locale = 'es';

export function isLocale(value: unknown): value is Locale {
  return value === 'es' || value === 'en';
}

export function languageToLocale(language: AppLanguage): Locale {
  return language === 'English' ? 'en' : 'es';
}

export function localeToLanguage(locale: Locale): AppLanguage {
  return locale === 'en' ? 'English' : 'Español';
}

export function readLocaleFromCookieString(
  cookieString: string
): Locale | null {
  for (const part of cookieString.split(';')) {
    const [name, ...rest] = part.trim().split('=');
    if (name !== LOCALE_COOKIE) continue;
    const value = rest.join('=');
    return isLocale(value) ? value : null;
  }
  return null;
}

export function readLocaleCookie(): Locale | null {
  if (typeof document === 'undefined') return null;
  return readLocaleFromCookieString(document.cookie);
}

export function writeLocaleCookie(locale: Locale): void {
  if (typeof document === 'undefined') return;
  document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=31536000; samesite=lax`;
}
