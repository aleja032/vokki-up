import { writeBrowserValue } from '../storage/browser-storage';
import { setAppLanguage, type AppLanguage } from './locale';
import { languageToLocale, writeLocaleCookie } from './locale-cookie';

export const LANGUAGE_STORAGE_KEY = 'settings/language';

/**
 * Applies a language chosen by the user. Storage and cookie are written first
 * and synchronously: `setAppLanguage` makes the locale provider remount the
 * whole tree, which would discard a pending state-driven storage write.
 */
export function commitAppLanguage(language: AppLanguage): void {
  writeBrowserValue(LANGUAGE_STORAGE_KEY, language);
  writeLocaleCookie(languageToLocale(language));
  setAppLanguage(language);
}
