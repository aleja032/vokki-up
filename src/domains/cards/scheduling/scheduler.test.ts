import { describe, expect, it } from 'vitest';
import {
  buildDueQueue,
  countDailyReviewEvents,
  deriveDailyCreditCount,
  recordReviewEvent
} from './progress';
import { incrementalReviewScheduler } from './scheduler';

describe('local review scheduling', () => {
  it('assigns deterministic intervals for the four rating buttons', () => {
    const reviewedAt = new Date('2026-10-23T12:00:00.000Z');
    const ratings = ['again', 'hard', 'good', 'easy'] as const;
    const intervals = ratings.map(
      rating =>
        incrementalReviewScheduler.schedule({
          cardId: 'card-1',
          current: undefined,
          rating,
          reviewedAt
        }).intervalMinutes
    );

    expect(intervals).toEqual([10, 1440, 2880, 5760]);
  });

  it('keeps every repeat in history but credits a card once per local day', () => {
    const first = recordReviewEvent([], {
      id: 'event-1',
      cardId: 'card-1',
      rating: 'again',
      reviewedAt: '2026-10-23T09:00:00.000Z',
      localDate: '2026-10-23'
    });
    const second = recordReviewEvent(first.events, {
      id: 'event-2',
      cardId: 'card-1',
      rating: 'good',
      reviewedAt: '2026-10-23T09:05:00.000Z',
      localDate: '2026-10-23'
    });

    expect(second.events).toHaveLength(2);
    expect(second.event.earnsDailyCredit).toBe(false);
    expect(deriveDailyCreditCount(second.events, '2026-10-23')).toBe(1);
    expect(countDailyReviewEvents(second.events, '2026-10-23')).toBe(2);
    const nextDay = recordReviewEvent(second.events, {
      id: 'event-3',
      cardId: 'card-1',
      rating: 'good',
      reviewedAt: '2026-10-24T08:00:00.000Z',
      localDate: '2026-10-24'
    });
    expect(nextDay.event.earnsDailyCredit).toBe(true);
  });

  it('queues new and due cards while excluding scheduled future cards', () => {
    const due = incrementalReviewScheduler.schedule({
      cardId: 'due-card',
      current: undefined,
      rating: 'good',
      reviewedAt: new Date('2026-10-20T10:00:00.000Z')
    });
    const future = incrementalReviewScheduler.schedule({
      cardId: 'future-card',
      current: undefined,
      rating: 'easy',
      reviewedAt: new Date('2026-10-23T10:00:00.000Z')
    });

    expect(
      buildDueQueue(
        [{ id: 'new-card' }, { id: 'due-card' }, { id: 'future-card' }],
        { 'due-card': due, 'future-card': future },
        new Date('2026-10-23T12:00:00.000Z')
      ).map(card => card.id)
    ).toEqual(['new-card', 'due-card']);
  });
});
