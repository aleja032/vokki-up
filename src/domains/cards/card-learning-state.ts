import { isMastered } from './scheduling/mastery';
import type { CardSchedule } from './scheduling/types';

export type CardLearningState = 'new' | 'learning' | 'mastered';

// Width of the progress bar shown on each card, per learning state.
export const LEARNING_STATE_PROGRESS: Record<CardLearningState, number> = {
  new: 15,
  learning: 55,
  mastered: 100
};

export function getCardLearningState(
  schedule: CardSchedule | undefined
): CardLearningState {
  if (!schedule) return 'new';
  return isMastered(schedule) ? 'mastered' : 'learning';
}

function startOfLocalDay(date: Date): number {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  ).getTime();
}

const DAY_MS = 24 * 60 * 60 * 1000;

// Calendar days from `now` until the card is due; overdue or invalid dates
// count as 0 (due today).
export function getDueDayOffset(dueAt: string, now: Date): number {
  const due = new Date(dueAt);
  if (Number.isNaN(due.getTime())) return 0;
  const days = Math.round(
    (startOfLocalDay(due) - startOfLocalDay(now)) / DAY_MS
  );
  return Math.max(0, days);
}
