import { describe, expect, it } from 'vitest';
import { getCardMemory, MAX_CARD_MEMORY } from './card-memory';
import type { CardSchedule } from './scheduling/types';

function schedule(repetitions: number): CardSchedule {
  return {
    cardId: 'c1',
    repetitions,
    intervalMinutes: 60,
    dueAt: '2026-01-02T00:00:00Z',
    lastReviewedAt: '2026-01-01T00:00:00Z',
    lastRating: 'good'
  };
}

describe('getCardMemory', () => {
  it('treats a card without schedule as new, with no filled segments', () => {
    expect(getCardMemory(undefined)).toEqual({ level: 0, tone: 'brand' });
  });

  it.each([
    [0, 'coral'],
    [1, 'coral'],
    [2, 'amber'],
    [3, 'amber'],
    [4, 'mint'],
    [5, 'mint']
  ] as const)('maps %i repetitions to the %s tone', (repetitions, tone) => {
    expect(getCardMemory(schedule(repetitions))).toEqual({
      level: repetitions,
      tone
    });
  });

  it('caps the level at the number of segments', () => {
    expect(getCardMemory(schedule(40)).level).toBe(MAX_CARD_MEMORY);
  });
});
