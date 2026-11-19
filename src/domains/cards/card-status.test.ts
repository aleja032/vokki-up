import { describe, expect, it } from 'vitest';
import {
  countCardStatuses,
  getCardStatus,
  matchesStatusFilter
} from './card-status';
import type { CardSchedule, CardScheduleMap } from './scheduling/types';

const now = new Date('2026-10-24T12:00:00.000Z');

const schedule = (
  cardId: string,
  overrides: Partial<CardSchedule> = {}
): CardSchedule => ({
  cardId,
  repetitions: 1,
  intervalMinutes: 24 * 60,
  dueAt: '2026-10-26T12:00:00.000Z',
  lastReviewedAt: '2026-10-23T12:00:00.000Z',
  lastRating: 'good',
  ...overrides
});

const schedules: CardScheduleMap = {
  overdue: schedule('overdue', { dueAt: '2026-10-20T12:00:00.000Z' }),
  growing: schedule('growing'),
  mastered: schedule('mastered', {
    repetitions: 4,
    intervalMinutes: 5 * 24 * 60
  }),
  masteredAndDue: schedule('masteredAndDue', {
    repetitions: 4,
    intervalMinutes: 5 * 24 * 60,
    dueAt: '2026-10-24T11:00:00.000Z'
  })
};

describe('getCardStatus', () => {
  it('treats a card without a schedule as due', () => {
    expect(getCardStatus('new', schedules, now)).toBe('due');
  });

  it('treats a card whose review date has arrived as due', () => {
    expect(getCardStatus('overdue', schedules, now)).toBe('due');
  });

  it('lets due win over mastered so each card has one status', () => {
    expect(getCardStatus('masteredAndDue', schedules, now)).toBe('due');
  });

  it('separates mastered from learning cards that are not due', () => {
    expect(getCardStatus('mastered', schedules, now)).toBe('mastered');
    expect(getCardStatus('growing', schedules, now)).toBe('learning');
  });
});

describe('matchesStatusFilter', () => {
  it('lets every card through the all filter', () => {
    expect(matchesStatusFilter('all', 'growing', schedules, now)).toBe(true);
  });

  it('keeps only the cards of the chosen status', () => {
    expect(matchesStatusFilter('learning', 'growing', schedules, now)).toBe(
      true
    );
    expect(matchesStatusFilter('learning', 'mastered', schedules, now)).toBe(
      false
    );
  });
});

describe('countCardStatuses', () => {
  it('counts one status per card so the parts add up to the total', () => {
    const cards = ['new', 'overdue', 'growing', 'mastered', 'masteredAndDue'];

    const counts = countCardStatuses(
      cards.map(id => ({ id })),
      schedules,
      now
    );

    expect(counts).toEqual({ all: 5, due: 3, learning: 1, mastered: 1 });
    expect(counts.due + counts.learning + counts.mastered).toBe(counts.all);
  });
});
