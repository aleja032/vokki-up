import { INITIAL_CARDS } from '../data';
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

// The starter cards shipped with the app carry their own English examples,
// which differ from the catalog ones (or are not catalog terms at all).
const STARTER_EXAMPLES_ES = [
  'reliable|Ella es una compañera confiable que siempre cumple sus plazos.',
  'deadline|Tenemos que terminar el informe antes de la fecha límite.',
  'to schedule|¿Podríamos programar una reunión para el jueves por la mañana?',
  'to catch up|Pongámonos al día con un café la próxima semana.',
  'boarding pass|Por favor, ten lista tu tarjeta de embarque en la puerta.',
  'a layover|Tenemos una escala de tres horas en Madrid.',
  'to get around|Es fácil moverse por la ciudad en metro.',
  'to run errands|Tengo que hacer algunos recados después del trabajo.',
  'thoughtful|Fue un comentario muy considerado.',
  'to make up your mind|Tómate tu tiempo antes de decidirte.',
  'I’m looking forward to it|Gracias por invitarme. Tengo muchas ganas de ir.',
  'to figure out|Encontraremos una mejor forma de organizar los archivos.'
];

const starterSpanishByTerm = parseExampleRows(STARTER_EXAMPLES_ES);
const starterExamplesByTerm = new Map<string, CatalogExample>();
for (const card of INITIAL_CARDS) {
  const key = normalizeCatalogTerm(card.term);
  const spanish = starterSpanishByTerm.get(key);
  if (spanish && card.example)
    starterExamplesByTerm.set(key, { english: card.example, spanish });
}

function matchesExample(
  match: CatalogExample | undefined,
  example: string | undefined
) {
  return match !== undefined && (example ?? '').trim() === match.english;
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

  const key = normalizeCatalogTerm(card.term);
  const catalogMatch = catalogExamplesByTerm.get(key);
  if (matchesExample(catalogMatch, card.example)) return catalogMatch?.spanish;
  const starterMatch = starterExamplesByTerm.get(key);
  if (matchesExample(starterMatch, card.example)) return starterMatch?.spanish;
  return undefined;
}
