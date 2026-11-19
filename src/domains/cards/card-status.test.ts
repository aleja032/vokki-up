import { describe, expect, it } from 'vitest';
import {
  countCardStatuses,
  getCardStatus,
  matchesStatusFilter
} from './card-status';
import type { CardSchedule, CardScheduleMap } from './scheduling/types';

const now = new Date('2026-10-24T12:00:00.000Z');

const schedule = (cardId: string, dueAt: string): CardSchedule => ({
  cardId,
  repetitions: 2,
  intervalMinutes: 24 * 60,
  dueAt,
  lastReviewedAt: '2026-10-23T12:00:00.000Z',
  lastRating: 'good'
});

const schedules: CardScheduleMap = {
  overdue: schedule('overdue', '2026-10-20T12:00:00.000Z'),
  dueNow: schedule('dueNow', '2026-10-24T12:00:00.000Z'),
  tomorrow: schedule('tomorrow', '2026-10-25T12:00:00.000Z'),
  weekEdge: schedule('weekEdge', '2026-10-31T12:00:00.000Z'),
  later: schedule('later', '2026-11-05T12:00:00.000Z')
};

describe('getCardStatus', () => {
  it('treats a card without a schedule as due', () => {
    expect(getCardStatus('new', schedules, now)).toBe('due');
  });

  it('treats overdue cards and cards due right now as due', () => {
    expect(getCardStatus('overdue', schedules, now)).toBe('due');
    expect(getCardStatus('dueNow', schedules, now)).toBe('due');
  });

  it('puts cards due within seven days in the week status', () => {
    expect(getCardStatus('tomorrow', schedules, now)).toBe('week');
    expect(getCardStatus('weekEdge', schedules, now)).toBe('week');
  });

  it('puts cards due later than a week in the safe status', () => {
    expect(getCardStatus('later', schedules, now)).toBe('safe');
  });
});

describe('matchesStatusFilter', () => {
  it('lets every card through the all filter', () => {
    expect(matchesStatusFilter('all', 'later', schedules, now)).toBe(true);
  });

  it('keeps only the cards of the chosen status', () => {
    expect(matchesStatusFilter('week', 'tomorrow', schedules, now)).toBe(true);
    expect(matchesStatusFilter('week', 'later', schedules, now)).toBe(false);
  });
});

describe('countCardStatuses', () => {
  it('counts one status per card so the parts add up to the total', () => {
    const cards = ['new', 'overdue', 'tomorrow', 'weekEdge', 'later'];

    const counts = countCardStatuses(
      cards.map(id => ({ id })),
      schedules,
      now
    );

    expect(counts).toEqual({ all: 5, due: 2, week: 2, safe: 1 });
    expect(counts.due + counts.week + counts.safe).toBe(counts.all);
  });
});
