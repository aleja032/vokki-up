import { describe, expect, it } from 'vitest';
import { getCardLearningState, getDueDayOffset } from './card-learning-state';
import type { CardSchedule } from './scheduling/types';

const baseSchedule: CardSchedule = {
  cardId: 'card-1',
  repetitions: 1,
  intervalMinutes: 60,
  dueAt: '2026-05-10T09:00:00.000Z',
  lastReviewedAt: '2026-05-09T09:00:00.000Z',
  lastRating: 'good'
};

describe('getCardLearningState', () => {
  it('marks a card without schedule as new', () => {
    expect(getCardLearningState(undefined)).toBe('new');
  });

  it('marks a scheduled card below the mastery threshold as learning', () => {
    expect(getCardLearningState(baseSchedule)).toBe('learning');
  });

  it('marks a card that reached the mastery threshold as mastered', () => {
    expect(
      getCardLearningState({
        ...baseSchedule,
        repetitions: 4,
        intervalMinutes: 5 * 24 * 60
      })
    ).toBe('mastered');
  });
});

describe('getDueDayOffset', () => {
  const now = new Date(2026, 4, 10, 15, 30);

  it('is 0 for a card due earlier today or already overdue', () => {
    expect(
      getDueDayOffset(new Date(2026, 4, 10, 8, 0).toISOString(), now)
    ).toBe(0);
    expect(getDueDayOffset(new Date(2026, 4, 2, 8, 0).toISOString(), now)).toBe(
      0
    );
  });

  it('counts calendar days ahead', () => {
    expect(
      getDueDayOffset(new Date(2026, 4, 11, 0, 5).toISOString(), now)
    ).toBe(1);
    expect(
      getDueDayOffset(new Date(2026, 4, 19, 23, 0).toISOString(), now)
    ).toBe(9);
  });

  it('falls back to 0 for an invalid date', () => {
    expect(getDueDayOffset('not-a-date', now)).toBe(0);
  });
});
