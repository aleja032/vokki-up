import { afterEach, describe, expect, it } from 'vitest';
import { setAppLanguage, translateText } from './locale';

// Every Spanish string in a localized messages object must have an English
// entry; otherwise it silently stays Spanish for English users.
const modules = import.meta.glob(
  [
    '/src/domains/*/messages.ts',
    '/src/domains/*/validation-messages.ts',
    '/src/config/*.ts',
    '/src/app/**/*messages.ts',
    '!/src/domains/writing/*.ts'
  ],
  { eager: true }
) as Record<string, Record<string, unknown>>;

const SPANISH_MARKERS =
  /[ñáéíóúÁÉÍÓÚ¿¡]|\b(el|la|los|las|de|del|para|con|tu|tus|una|un|que|por|sin|tarjetas?|nota|guardar|cancelar|crear)\b/i;
const IGNORED = new Set<string>(['Vokki Up']);

function collect(value: unknown, path: string, out: Map<string, string>) {
  if (typeof value === 'string') {
    out.set(path, value);
  } else if (typeof value === 'function') {
    try {
      const sample = (value as (...args: unknown[]) => unknown)(3, 2, 1);
      if (typeof sample === 'string') out.set(`${path}()`, sample);
    } catch {
      // functions needing structured arguments are covered by dynamic tests
    }
  } else if (Array.isArray(value)) {
    value.forEach((item, index) => collect(item, `${path}[${index}]`, out));
  } else if (value && typeof value === 'object') {
    for (const [key, item] of Object.entries(value))
      collect(item, `${path}.${key}`, out);
  }
}

describe('message coverage', () => {
  afterEach(() => setAppLanguage('Español'));

  it('translates every Spanish message into English', () => {
    const missing: string[] = [];
    for (const [file, mod] of Object.entries(modules)) {
      const strings = new Map<string, string>();
      for (const [name, value] of Object.entries(mod))
        collect(value, `${file}#${name}`, strings);
      setAppLanguage('English');
      for (const [path, text] of strings) {
        if (IGNORED.has(text) || !SPANISH_MARKERS.test(text)) continue;
        const translated = translateText(text);
        if (translated === text || SPANISH_MARKERS.test(translated))
          missing.push(`${path}: ${text}`);
      }
      setAppLanguage('Español');
    }
    expect(missing).toEqual([]);
  });
});
