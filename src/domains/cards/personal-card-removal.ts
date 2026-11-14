import type { CardScheduleMap, ReviewEvent } from './scheduling/types';
import type { VocabularyCard } from './types';

export type PersonalCardData = {
  cards: VocabularyCard[];
  schedules: CardScheduleMap;
  reviewEvents: ReviewEvent[];
};

/** Removes selected cards and only the progress records that reference them. */
export function removePersonalCards(
  data: PersonalCardData,
  cardIds: readonly string[]
): PersonalCardData {
  const idsToRemove = new Set(cardIds);
  if (!data.cards.some(card => idsToRemove.has(card.id))) return data;

  const schedules = { ...data.schedules };
  for (const cardId of idsToRemove) delete schedules[cardId];

  return {
    cards: data.cards.filter(card => !idsToRemove.has(card.id)),
    schedules,
    reviewEvents: data.reviewEvents.filter(
      event => !idsToRemove.has(event.cardId)
    )
  };
}
