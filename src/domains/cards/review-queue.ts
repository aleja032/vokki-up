import type { CardRating } from './types';

// How many other cards come before a card rated "again" returns in the round.
export const AGAIN_REQUEUE_GAP = 3;

// Inserts the card again after a few other cards; a nearly empty round puts
// it at the end. The queue grows until the card is answered with another rating.
export function requeueForAgain<T>(
  queue: T[],
  index: number,
  item: T,
  gap: number = AGAIN_REQUEUE_GAP
): T[] {
  const position = Math.min(index + 1 + gap, queue.length);
  return [...queue.slice(0, position), item, ...queue.slice(position)];
}

export type RatingSummary = Record<CardRating, number> & { reviewed: number };

export function summarizeRatings(
  ratings: Record<CardRating, number>
): RatingSummary {
  return {
    reviewed: ratings.again + ratings.hard + ratings.good + ratings.easy,
    again: ratings.again,
    hard: ratings.hard,
    good: ratings.good,
    easy: ratings.easy
  };
}
