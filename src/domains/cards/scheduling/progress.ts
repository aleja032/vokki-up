import type { CardRating } from '../types';
import type {
  CardScheduleMap,
  ReviewEvent,
  ReviewEventInput,
  ReviewableCard
} from './types';

export function recordReviewEvent(
  events: ReviewEvent[],
  input: ReviewEventInput
): { event: ReviewEvent; events: ReviewEvent[] } {
  const earnsDailyCredit = !events.some(
    event =>
      event.cardId === input.cardId && event.localDate === input.localDate
  );
  const event: ReviewEvent = { ...input, earnsDailyCredit };

  return { event, events: [...events, event] };
}

export function deriveDailyCreditCount(
  events: ReviewEvent[],
  localDate: string
): number {
  return events.filter(
    event => event.localDate === localDate && event.earnsDailyCredit
  ).length;
}

export function countDailyReviewEvents(
  events: ReviewEvent[],
  localDate: string
): number {
  return events.filter(event => event.localDate === localDate).length;
}

export function buildDueQueue<T extends ReviewableCard>(
  cards: T[],
  schedules: CardScheduleMap,
  now: Date,
  limit = 10
): T[] {
  return cards
    .filter(card => {
      const schedule = schedules[card.id];
      return !schedule || Date.parse(schedule.dueAt) <= now.getTime();
    })
    .slice(0, Math.max(0, limit));
}

export function getLocalDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function isCardRating(value: unknown): value is CardRating {
  return (
    value === 'again' ||
    value === 'hard' ||
    value === 'good' ||
    value === 'easy'
  );
}
