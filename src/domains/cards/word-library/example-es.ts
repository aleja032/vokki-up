import type { VocabularyCard } from '../types';
import { normalizeCatalogTerm, wordLibraryCatalog } from './catalog';
import { DAILY_EXAMPLES_ES } from './example-es-daily';
import { PHRASES_EXAMPLES_ES } from './example-es-phrases';
import { TRAVEL_EXAMPLES_ES } from './example-es-travel';
import { WORK_EXAMPLES_ES } from './example-es-work';

/** Parses `term|Spanish sentence` rows into a map keyed by normalized term. */
export function parseExampleRows(rows: readonly string[]) {
  const map = new Map<string, string>();
  for (const row of rows) {
    const separator = row.indexOf('|');
    if (separator < 1) continue;
    map.set(
      normalizeCatalogTerm(row.slice(0, separator)),
      row.slice(separator + 1).trim()
    );
  }
  return map;
}

const spanishByTerm = parseExampleRows([
  ...WORK_EXAMPLES_ES,
  ...TRAVEL_EXAMPLES_ES,
  ...DAILY_EXAMPLES_ES,
  ...PHRASES_EXAMPLES_ES
]);

type CatalogExample = { english: string; spanish: string };

const catalogExamplesByTerm = new Map<string, CatalogExample>();
for (const entry of wordLibraryCatalog) {
  const key = normalizeCatalogTerm(entry.term);
  const spanish = spanishByTerm.get(key);
  if (spanish)
    catalogExamplesByTerm.set(key, { english: entry.example, spanish });
}

/**
 * Spanish example for a card, or undefined when there is none.
 * The value stored on the card wins. Otherwise the catalog translation is used
 * when the term is a catalog term and the card still carries the catalog's
 * English example, so a custom or edited example never shows a stale
 * translation.
 */
export function getExampleEs(
  card: Pick<VocabularyCard, 'term' | 'example' | 'exampleEs'>
): string | undefined {
  const own = card.exampleEs?.trim();
  if (own) return own;

  const match = catalogExamplesByTerm.get(normalizeCatalogTerm(card.term));
  if (!match) return undefined;
  return (card.example ?? '').trim() === match.english
    ? match.spanish
    : undefined;
}
