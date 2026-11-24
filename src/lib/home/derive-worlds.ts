import { getAppLanguage } from '../i18n/locale';
import type { WorldId, WorldProgress } from './home-hand.types';

// Worlds are the default word-library categories, in the order the home shows.
const WORLDS: { id: WorldId; category: string }[] = [
  { id: 'daily', category: 'Día a día' },
  { id: 'work', category: 'Trabajo' },
  { id: 'travel', category: 'Viajes' },
  { id: 'phrases', category: 'Frases útiles' }
];

// The categories are stored in Spanish. A dedicated map is used because the
// global translation table falls back to substring replacement and does not
// carry bare category names such as "Trabajo" or "Viajes".
const ENGLISH_WORLD_NAMES: Record<string, string> = {
  'Día a día': 'Daily life',
  Trabajo: 'Work',
  Viajes: 'Travel',
  'Frases útiles': 'Useful phrases'
};

export function getWorldDisplayName(category: string): string {
  return getAppLanguage() === 'English'
    ? (ENGLISH_WORLD_NAMES[category] ?? category)
    : category;
}

type CatalogEntry = { term: string; category: string };

/**
 * Progress per world: how many catalog words of the category the user already
 * owns as cards, out of every catalog word of that category.
 */
export function deriveWorldProgress(
  catalog: readonly CatalogEntry[],
  ownedTerms: string[],
  normalize: (term: string) => string
): WorldProgress[] {
  const owned = new Set(ownedTerms.map(normalize));

  return WORLDS.map(({ id, category }) => {
    const entries = catalog.filter(entry => entry.category === category);
    const learned = entries.filter(entry =>
      owned.has(normalize(entry.term))
    ).length;
    return { id, name: category, learned, total: entries.length };
  });
}
