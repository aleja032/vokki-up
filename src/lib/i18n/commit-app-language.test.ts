import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { commitAppLanguage } from './commit-app-language';
import { getAppLanguage, setAppLanguage, subscribeAppLanguage } from './locale';

describe('commitAppLanguage', () => {
  const store = new Map<string, string>();
  const cookieWrites: string[] = [];

  beforeEach(() => {
    store.clear();
    cookieWrites.length = 0;
    vi.stubGlobal('window', {
      localStorage: {
        getItem: (key: string) => store.get(key) ?? null,
        setItem: (key: string, value: string) => store.set(key, value)
      }
    });
    vi.stubGlobal('document', {
      set cookie(value: string) {
        cookieWrites.push(value);
      },
      get cookie() {
        return '';
      }
    });
  });

  afterEach(() => {
    setAppLanguage('Español');
    vi.unstubAllGlobals();
  });

  it('persists the language and the cookie', () => {
    commitAppLanguage('English');
    expect(store.get('vokki-up:settings/language')).toBe(
      JSON.stringify({ version: 1, value: 'English' })
    );
    expect(cookieWrites[0]).toContain('vokki-locale=en');
    expect(getAppLanguage()).toBe('English');
  });

  // The locale provider remounts the whole tree when the language changes, so
  // storage must already hold the new value when subscribers are notified.
  it('writes storage before notifying language subscribers', () => {
    let storedWhenNotified: string | undefined;
    const unsubscribe = subscribeAppLanguage(() => {
      storedWhenNotified = store.get('vokki-up:settings/language');
    });
    commitAppLanguage('English');
    unsubscribe();
    expect(storedWhenNotified).toBe(
      JSON.stringify({ version: 1, value: 'English' })
    );
  });
});
