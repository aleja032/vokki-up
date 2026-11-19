import { isMastered } from './scheduling/mastery';
import type { CardScheduleMap } from './scheduling/types';

// Status filter of the Mi mazo library. Every card has exactly one status, so
// the counts of the three statuses add up to the total:
// - due: new, or its review date has arrived (the same rule as the due queue)
// - mastered: not due and past the mastery threshold
// - learning: everything else
export type CardStatus = 'due' | 'learning' | 'mastered';
export type CardStatusFilter = 'all' | CardStatus;
export type CardStatusCounts = Record<CardStatusFilter, number>;

export const ALL_CARD_STATUSES: CardStatusFilter = 'all';

export function getCardStatus(
  cardId: string,
  schedules: CardScheduleMap,
  now: Date
): CardStatus {
  const schedule = schedules[cardId];
  if (!schedule || Date.parse(schedule.dueAt) <= now.getTime()) return 'due';
  return isMastered(schedule) ? 'mastered' : 'learning';
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
    learning: 0,
    mastered: 0
  };
  for (const card of cards) counts[getCardStatus(card.id, schedules, now)] += 1;
  return counts;
}
