import { describe, expect, it } from 'vitest';
import type { CardSchedule } from './types';
import { isMastered } from './mastery';

const schedule = (overrides: Partial<CardSchedule> = {}): CardSchedule => ({
  cardId: 'card-1',
  repetitions: 3,
  intervalMinutes: 4 * 24 * 60,
  dueAt: '2026-10-27T12:00:00.000Z',
  lastReviewedAt: '2026-10-23T12:00:00.000Z',
  lastRating: 'good',
  ...overrides
});

describe('isMastered', () => {
  it('marks a card mastered only after the explicit repetition, rating, and interval thresholds', () => {
    expect(isMastered(schedule())).toBe(true);
    expect(isMastered(schedule({ repetitions: 2 }))).toBe(false);
    expect(isMastered(schedule({ lastRating: 'hard' }))).toBe(false);
    expect(isMastered(schedule({ lastRating: 'again' }))).toBe(false);
    expect(isMastered(schedule({ intervalMinutes: 4 * 24 * 60 - 1 }))).toBe(
      false
    );
    expect(isMastered(undefined)).toBe(false);
  });

  it('accepts easy as a final rating when all thresholds are met', () => {
    expect(isMastered(schedule({ lastRating: 'easy' }))).toBe(true);
  });
});
