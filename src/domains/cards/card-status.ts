import type { CardScheduleMap } from './scheduling/types';

// Review-time filter of the Mi mazo library. Every card has exactly one
// status, so the counts of the three statuses add up to the total:
// - due: new, or its review date has arrived (the same rule as the due queue)
// - week: not due yet, but due within the next seven days
// - safe: due later than that
export type CardStatus = 'due' | 'week' | 'safe';
export type CardStatusFilter = 'all' | CardStatus;
export type CardStatusCounts = Record<CardStatusFilter, number>;

export const ALL_CARD_STATUSES: CardStatusFilter = 'all';

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

export function getCardStatus(
  cardId: string,
  schedules: CardScheduleMap,
  now: Date
): CardStatus {
  const schedule = schedules[cardId];
  if (!schedule) return 'due';
  const dueAt = Date.parse(schedule.dueAt);
  if (dueAt <= now.getTime()) return 'due';
  return dueAt <= now.getTime() + WEEK_MS ? 'week' : 'safe';
}

export function matchesStatusFilter(
  filter: CardStatusFilter,
  cardId: string,
  schedules: CardScheduleMap,
  now: Date
): boolean {
  return filter === 'all' || getCardStatus(cardId, schedules, now) === filter;
}

export function countCardStatuses(
  cards: readonly { id: string }[],
  schedules: CardScheduleMap,
  now: Date
): CardStatusCounts {
  const counts: CardStatusCounts = {
    all: cards.length,
    due: 0,
    week: 0,
    safe: 0
  };
  for (const card of cards) counts[getCardStatus(card.id, schedules, now)] += 1;
  return counts;
}
