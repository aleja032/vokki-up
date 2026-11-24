import { afterEach, describe, expect, it } from 'vitest';
import { setAppLanguage, translateText } from './locale';
import { getWorldDisplayName } from '../home/derive-worlds';
import { CARD_PARTS_OF_SPEECH } from '@/domains/cards/card-create.schema';
import { INITIAL_GROUPS } from '@/domains/cards/data';
import {
  getGroupDisplayDescription,
  getGroupDisplayName
} from '@/domains/cards/group-display';
import {
  WORD_LIBRARY_CATEGORIES,
  WORD_LIBRARY_LEVEL_LABELS
} from '@/domains/cards/word-library/catalog';
import {
  WORLDS,
  getWorldDisplayName as getLibraryWorldName
} from '@/domains/cards/word-library/worlds';

// Static audit of the labels the app itself provides (not the Spanish meanings
// and examples of the learning words, which stay Spanish by design).
const SPANISH =
  /[ñáéíóúÁÉÍÓÚ¿¡]|\b(el|la|los|las|del|para|con|sin|tu|tus|una|nueva|nuevo|palabras?|tarjetas?|grupos?|repasar|hoy|ahora|guardar|cancelar|volver|inicio|notas?|agregar|crear|eliminar|buscar|mundos?|trabajo|viajes|frases?|nivel|b[aá]sico|intermedio|avanzado|sustantivo|verbo|adjetivo|adverbio|expresi[oó]n|d[ií]a|reuniones|oficina)\b/i;

const messageModules = import.meta.glob(
  [
    '/src/domains/*/messages.ts',
    '/src/domains/*/validation-messages.ts',
    '/src/domains/*/*/messages.ts',
    '/src/app/**/*messages.ts',
    '!/src/domains/writing/**'
  ],
  { eager: true }
) as Record<string, Record<string, unknown>>;

function collect(value: unknown, path: string, out: Map<string, string>) {
  if (typeof value === 'string') out.set(path, value);
  else if (typeof value === 'function') {
    try {
      const sample = (value as (...args: unknown[]) => unknown)(3, 2, 1);
      if (typeof sample === 'string') out.set(`${path}()`, sample);
    } catch {
      // functions needing structured arguments are skipped
    }
  } else if (Array.isArray(value))
    value.forEach((item, index) => collect(item, `${path}[${index}]`, out));
  else if (value && typeof value === 'object')
    for (const [key, item] of Object.entries(value))
      collect(item, `${path}.${key}`, out);
}

describe('app-provided labels in English', () => {
  afterEach(() => setAppLanguage('Español'));

  it('leaves no Spanish word in any messages module', () => {
    const leaks: string[] = [];
    for (const [file, mod] of Object.entries(messageModules)) {
      // Language first: some messages (tag suggestions) depend on it.
      setAppLanguage('English');
      const strings = new Map<string, string>();
      for (const [name, value] of Object.entries(mod))
        collect(value, `${file}#${name}`, strings);
      for (const [path, text] of strings) {
        const translated = translateText(text);
        if (SPANISH.test(translated)) leaks.push(`${path}: ${translated}`);
      }
      setAppLanguage('Español');
    }
    expect(leaks).toEqual([]);
  });

  it('shows parts of speech, levels and categories in English', () => {
    setAppLanguage('English');
    const labels = [
      ...CARD_PARTS_OF_SPEECH.map(part => translateText(part)),
      ...Object.values(WORD_LIBRARY_LEVEL_LABELS).map(label =>
        translateText(label)
      ),
      ...WORD_LIBRARY_CATEGORIES.map(category => getWorldDisplayName(category)),
      ...WORLDS.map(world => getLibraryWorldName(world)),
      ...INITIAL_GROUPS.flatMap(group => [
        getGroupDisplayName(group),
        getGroupDisplayDescription(group)
      ])
    ];
    expect(labels.filter(label => SPANISH.test(label))).toEqual([]);
  });
});
