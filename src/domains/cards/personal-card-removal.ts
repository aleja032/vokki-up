import type { CardScheduleMap, ReviewEvent } from './scheduling/types';
import type { VocabularyCard } from './types';
import { normalizeCatalogTerm } from './word-library/catalog';

export function getPersonalCardsForCatalogTerm(
  cards: readonly VocabularyCard[],
  term: string
) {
  const normalizedTerm = normalizeCatalogTerm(term);
  return cards.filter(
    card => normalizeCatalogTerm(card.term) === normalizedTerm
  );
}

export function removePersonalCardsById(
  cards: readonly VocabularyCard[],
  cardIds: readonly string[]
) {
  const idsToRemove = new Set(cardIds);
  if (idsToRemove.size === 0) return [...cards];
  return cards.filter(card => !idsToRemove.has(card.id));
}

export function removeCardSchedulesById(
  schedules: CardScheduleMap,
  cardIds: readonly string[]
): CardScheduleMap {
  if (cardIds.length === 0) return schedules;
  const nextSchedules = { ...schedules };
  for (const cardId of cardIds) delete nextSchedules[cardId];
  return nextSchedules;
}

export function removeReviewEventsByCardId(
  events: readonly ReviewEvent[],
  cardIds: readonly string[]
) {
  const idsToRemove = new Set(cardIds);
  if (idsToRemove.size === 0) return [...events];
  return events.filter(event => !idsToRemove.has(event.cardId));
}
