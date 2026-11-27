import type { CardRating } from './types';
import { countRoundCards, type RoundSize } from './review-round-size';

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

export type NextRound =
  | { kind: 'due'; count: number; remaining: number }
  | { kind: 'ahead'; count: number };

// What the finished-round screen offers next: the rest of today's due cards
// first, then studying ahead, else nothing (the plain finish state).
export function resolveNextRound(input: {
  size: RoundSize;
  dueRemaining: number;
  aheadAvailable: number;
}): NextRound | null {
  if (input.dueRemaining > 0)
    return {
      kind: 'due',
      count: countRoundCards(input.size, input.dueRemaining),
      remaining: input.dueRemaining
    };
  if (input.aheadAvailable > 0)
    return {
      kind: 'ahead',
      count: countRoundCards(input.size, input.aheadAvailable)
    };
  return null;
}
