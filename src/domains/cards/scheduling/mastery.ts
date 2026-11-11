import type { CardSchedule } from './types';

/**
 * Explicit product definition for the Home “mastered” statistic.
 * The current interval scheduler is heuristic, so this is a progress threshold,
 * not an estimate of recall probability.
 */
export const MASTERY_MIN_REPETITIONS = 3;
export const MASTERY_MIN_INTERVAL_MINUTES = 4 * 24 * 60;

export function isMastered(schedule: CardSchedule | undefined): boolean {
  return Boolean(
    schedule &&
      schedule.repetitions >= MASTERY_MIN_REPETITIONS &&
      (schedule.lastRating === 'good' || schedule.lastRating === 'easy') &&
      schedule.intervalMinutes >= MASTERY_MIN_INTERVAL_MINUTES
  );
}
