import { getAppLanguage } from '@/lib/i18n/locale';
import {
  normalizeCatalogTerm,
  WORD_LIBRARY_LEVELS,
  type WordLibraryCategory,
  type WordLibraryEntry,
  type WordLibraryLevel
} from './catalog';

/**
 * A world is one theme of the word library catalog (proposal D, "Mundos").
 * It is not one of the user's deck folders: its words are the static catalog
 * entries of one category, and its progress is how many of them the user
 * already owns as cards.
 */
export type WorldId = 'daily' | 'work' | 'travel' | 'phrases';

export type World = {
  id: WorldId;
  category: WordLibraryCategory;
};

/** Order of the proposal: the home shows the worlds in the same order. */
export const WORLDS: readonly World[] = [
  { id: 'daily', category: 'Día a día' },
  { id: 'work', category: 'Trabajo' },
  { id: 'travel', category: 'Viajes' },
  { id: 'phrases', category: 'Frases útiles' }
];

export type WorldLevelProgress = { total: number; inDeck: number };

export type WorldSummary = World & {
  total: number;
  inDeck: number;
  levels: Record<WordLibraryLevel, WorldLevelProgress>;
};

// The category names are stored in Spanish; a dedicated map is used because the
// global translation table also rewrites longer strings that contain them.
const ENGLISH_WORLD_NAMES: Record<WordLibraryCategory, string> = {
  'Día a día': 'Daily life',
  Trabajo: 'Work',
  Viajes: 'Travel',
  'Frases útiles': 'Useful phrases'
};

export function getWorldDisplayName(world: World): string {
  return getAppLanguage() === 'English'
    ? ENGLISH_WORLD_NAMES[world.category]
    : world.category;
}

export function findWorld(id: string | null | undefined): World | undefined {
  return WORLDS.find(world => world.id === id);
}

/** Real progress per world from the catalog and the terms the user owns. */
export function summarizeWorlds(
  catalog: readonly WordLibraryEntry[],
  ownedTerms: ReadonlySet<string>
): WorldSummary[] {
  return WORLDS.map(world => {
    const entries = catalog.filter(entry => entry.category === world.category);
    const isOwned = (entry: WordLibraryEntry) =>
      ownedTerms.has(normalizeCatalogTerm(entry.term));
    const levels = {} as Record<WordLibraryLevel, WorldLevelProgress>;
    for (const level of WORD_LIBRARY_LEVELS) {
      const inLevel = entries.filter(entry => entry.level === level);
      levels[level] = {
        total: inLevel.length,
        inDeck: inLevel.filter(isOwned).length
      };
    }
    return {
      ...world,
      total: entries.length,
      inDeck: entries.filter(isOwned).length,
      levels
    };
  });
}
