import type { WorldId, WorldProgress } from './home-hand.types';

// Worlds are the default word-library categories, in the order the home shows.
const WORLDS: { id: WorldId; category: string }[] = [
  { id: 'daily', category: 'Día a día' },
  { id: 'work', category: 'Trabajo' },
  { id: 'travel', category: 'Viajes' },
  { id: 'phrases', category: 'Frases útiles' }
];

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
