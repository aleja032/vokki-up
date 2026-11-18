import { afterEach, describe, expect, it } from 'vitest';
import { setAppLanguage, translateText } from './locale';

// message-coverage.test.ts only sees exported `messages.ts` modules and uses a
// narrow Spanish marker list. This test reads the sources and checks the plain
// string literals inside every `createLocalizedMessages({...})` block (inline
// component blocks included, template literals excluded) with a wider marker
// list, plus a list of strings that used to leak Spanish into English mode.
// It does NOT scan arbitrary JSX literals outside those blocks.
const sources = import.meta.glob(
  [
    '/src/**/*.{ts,tsx}',
    '!/src/**/*.test.{ts,tsx}',
    '!/src/domains/writing/**',
    '!/src/lib/i18n/**'
  ],
  { eager: true, query: '?raw', import: 'default' }
) as Record<string, string>;

const SPANISH_MARKERS =
  /[ñáéíóúÁÉÍÓÚ¿¡]|\b(el|la|los|las|de|del|para|con|tu|tus|una|un|que|por|sin|tarjetas?|nota|guardar|cancelar|crear|biblioteca|agregar|palabras?|inicio|hoy|ajustes|sesión|dispositivo|grupos?|añadir|guardado|repasar|vocabulario|revisar|mazo|propuestas?|dominadas?|este|esta|ejemplo|significado|vistas?|racha|espa[ñn]ol|opcional)\b|\bEj\./i;
const IGNORED = new Set<string>(['Vokki Up', 'vokki-up-tarjetas-ejemplo.csv']);
// Matches `createLocalizedMessages(` and `createLocalizedMessages<Type>(`.
const CALL = /createLocalizedMessages(?:<[^>(]*>)?\(/g;

/** Returns the text between the parentheses of a call starting at `start`. */
function readBalancedCall(source: string, start: number): string {
  let depth = 0;
  let index = start;
  while (index < source.length) {
    const char = source[index];
    if (char === '/' && source[index + 1] === '/') {
      index = source.indexOf('\n', index);
      if (index === -1) break;
    } else if (char === '/' && source[index + 1] === '*') {
      index = source.indexOf('*/', index) + 1;
    } else if (char === "'" || char === '"' || char === '`') {
      index = skipString(source, index);
    } else if (char === '(') {
      depth += 1;
    } else if (char === ')') {
      depth -= 1;
      if (depth === 0) return source.slice(start, index);
    }
    index += 1;
  }
  return source.slice(start);
}

/** Returns the index of the closing quote of the string opening at `start`. */
function skipString(source: string, start: number): number {
  const quote = source[start];
  let index = start + 1;
  while (index < source.length && source[index] !== quote) {
    if (source[index] === '\\') index += 1;
    index += 1;
  }
  return index;
}

function extractLiterals(block: string): string[] {
  const literals: string[] = [];
  let index = 0;
  while (index < block.length) {
    const char = block[index];
    if (char === '/' && block[index + 1] === '/') {
      const end = block.indexOf('\n', index);
      index = end === -1 ? block.length : end;
    } else if (char === "'" || char === '"' || char === '`') {
      const end = skipString(block, index);
      const literal = block.slice(index + 1, end);
      // Interpolated templates are sampled by message-coverage.test.ts.
      if (!literal.includes('${'))
        literals.push(literal.replace(/\\(['"`\\])/g, '$1'));
      index = end;
    }
    index += 1;
  }
  return literals;
}

function collectInlineLiterals(): Map<string, string[]> {
  const found = new Map<string, string[]>();
  for (const [file, source] of Object.entries(sources)) {
    for (const match of source.matchAll(CALL)) {
      const open = match.index + match[0].length - 1;
      const literals = extractLiterals(readBalancedCall(source, open));
      if (literals.length)
        found.set(file, [...(found.get(file) ?? []), ...literals]);
    }
  }
  return found;
}

// Strings that were visible in Spanish while English was selected.
const FIXED_STRINGS = [
  'Biblioteca de palabras',
  'Biblioteca',
  'Explora vocabulario y guárdalo en tus grupos',
  'Buscar en la biblioteca',
  'Agregar desde la biblioteca',
  'Imagen y Palabras están bloqueadas',
  'Ir a la biblioteca',
  'Repasar este grupo · 3',
  'de 20 hoy',
  '3 palabras agregadas a sus colecciones',
  '1 · Agregar',
  '3 / 20 palabras o frases',
  'Racha actual',
  'Palabras vistas',
  'Mostrar ejemplo en español',
  'Ocultar ejemplo en español',
  'Ejemplo en español (opcional)',
  'La misma frase, en español'
];

describe('inline message coverage', () => {
  afterEach(() => setAppLanguage('Español'));

  it('finds inline blocks to check', () => {
    expect(collectInlineLiterals().size).toBeGreaterThan(0);
  });

  it('translates every Spanish literal of inline createLocalizedMessages blocks', () => {
    setAppLanguage('English');
    const missing: string[] = [];
    for (const [file, literals] of collectInlineLiterals()) {
      for (const text of new Set(literals)) {
        if (IGNORED.has(text) || !SPANISH_MARKERS.test(text)) continue;
        const translated = translateText(text);
        if (translated === text || SPANISH_MARKERS.test(translated))
          missing.push(`${file}: ${text}`);
      }
    }
    expect(missing).toEqual([]);
  });

  it('translates the strings that used to stay Spanish', () => {
    setAppLanguage('English');
    const missing = FIXED_STRINGS.filter(text => {
      const translated = translateText(text);
      return translated === text || SPANISH_MARKERS.test(translated);
    });
    expect(missing).toEqual([]);
  });
});
