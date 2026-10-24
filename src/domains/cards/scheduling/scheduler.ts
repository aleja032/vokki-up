import type { CardRating } from '../types';
import type { ReviewScheduler, ScheduleReviewInput } from './types';

/** Product default for a future FSRS scheduler; this interval heuristic does not estimate recall probability. */
export const DESIRED_RETENTION = 0.9;

const FIRST_INTERVAL_MINUTES: Record<CardRating, number> = {
  again: 10,
  hard: 60 * 24,
  good: 60 * 48,
  easy: 60 * 96
};

const INTERVAL_GROWTH: Record<Exclude<CardRating, 'again'>, number> = {
  // The simple local scheduler grows intervals; FSRS can replace this port later.
  hard: 1.2,
  good: 2.5,
  easy: 3
};

const MINIMUM_INTERVAL_MINUTES: Record<Exclude<CardRating, 'again'>, number> = {
  hard: 60 * 24,
  good: 60 * 48,
  easy: 60 * 96
};

export const incrementalReviewScheduler: ReviewScheduler = {
  schedule({ cardId, current, rating, reviewedAt }: ScheduleReviewInput) {
    const intervalMinutes = getIntervalMinutes(
      current?.intervalMinutes,
      rating
    );
    const reviewedAtIso = reviewedAt.toISOString();

    return {
      cardId,
      repetitions: rating === 'again' ? 0 : (current?.repetitions ?? 0) + 1,
      intervalMinutes,
      dueAt: new Date(
        reviewedAt.getTime() + intervalMinutes * 60_000
      ).toISOString(),
      lastReviewedAt: reviewedAtIso,
      lastRating: rating
    };
  }
};

function getIntervalMinutes(
  currentInterval: number | undefined,
  rating: CardRating
): number {
  if (rating === 'again') return FIRST_INTERVAL_MINUTES.again;
  if (currentInterval === undefined) return FIRST_INTERVAL_MINUTES[rating];

  return Math.max(
    MINIMUM_INTERVAL_MINUTES[rating],
    Math.round(currentInterval * INTERVAL_GROWTH[rating])
  );
}
