'use client';

import {
  Fragment,
  type ReactNode,
  useEffect,
  useSyncExternalStore
} from 'react';
import { readBrowserValue } from '@/lib/storage/browser-storage';
import {
  getAppLanguage,
  setAppLanguage,
  subscribeAppLanguage,
  type AppLanguage
} from './locale';
import {
  languageToLocale,
  readLocaleCookie,
  writeLocaleCookie
} from './locale-cookie';

function isAppLanguage(value: unknown): value is AppLanguage {
  return value === 'Español' || value === 'English';
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const language = useSyncExternalStore(
    subscribeAppLanguage,
    getAppLanguage,
    getAppLanguage
  );

  useEffect(() => {
    const stored = readBrowserValue('settings/language');
    if (!isAppLanguage(stored)) return;
    setAppLanguage(stored);
    const locale = languageToLocale(stored);
    if (readLocaleCookie() !== locale) writeLocaleCookie(locale);
  }, []);

  useEffect(() => {
    document.documentElement.lang = language === 'English' ? 'en' : 'es';
  }, [language]);

  return <Fragment key={language}>{children}</Fragment>;
}
