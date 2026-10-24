import { describe, expect, it } from 'vitest';
import { THEME_INIT_SCRIPT, THEME_STORAGE_KEY } from './theme-init-script';

type FakeDocument = { documentElement: { dataset: { theme?: string } } };

function runScript(storedRaw: string | null | 'throw') {
  const document: FakeDocument = { documentElement: { dataset: {} } };
  const localStorage = {
    getItem(key: string) {
      if (storedRaw === 'throw') throw new Error('storage unavailable');
      return key === `vokki-up:${THEME_STORAGE_KEY}` ? storedRaw : null;
    }
  };
  new Function('localStorage', 'document', THEME_INIT_SCRIPT)(
    localStorage,
    document
  );
  return document.documentElement.dataset.theme;
}

function envelope(value: unknown, version = 1) {
  return JSON.stringify({ version, value });
}

describe('THEME_INIT_SCRIPT', () => {
  it('applies a stored dark theme before the app hydrates', () => {
    expect(runScript(envelope('dark'))).toBe('dark');
  });

  it('applies a stored light theme', () => {
    expect(runScript(envelope('light'))).toBe('light');
  });

  it('leaves the system preference alone when the stored theme is "system"', () => {
    expect(runScript(envelope('system'))).toBeUndefined();
  });

  it('leaves the system preference alone when nothing is stored', () => {
    expect(runScript(null)).toBeUndefined();
  });

  it('ignores an envelope with another storage version', () => {
    expect(runScript(envelope('dark', 2))).toBeUndefined();
  });

  it('ignores unknown theme values', () => {
    expect(runScript(envelope('sepia'))).toBeUndefined();
  });

  it('never throws on malformed JSON or unavailable storage', () => {
    expect(() => runScript('{not json')).not.toThrow();
    expect(() => runScript('throw')).not.toThrow();
  });
});
