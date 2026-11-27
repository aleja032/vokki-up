import { describe, expect, it } from 'vitest';
import { buildAheadQueue, buildDueQueue } from './progress';
import type { CardScheduleMap } from './types';

const now = new Date('2026-03-10T12:00:00.000Z');

function schedule(cardId: string, dueAt: string) {
  return {
    cardId,
    dueAt,
    intervalMinutes: 60,
    easeFactor: 2.5,
    repetitions: 1,
    lapses: 0,
    lastReviewedAt: '2026-03-09T12:00:00.000Z'
  };
}

const cards = ['a', 'b', 'c', 'd', 'e', 'f'].map(id => ({ id }));
const schedules = {
  a: schedule('a', '2026-03-10T11:00:00.000Z'),
  b: schedule('b', '2026-03-14T12:00:00.000Z'),
  c: schedule('c', '2026-03-11T12:00:00.000Z'),
  d: schedule('d', '2026-03-10T12:00:00.000Z'),
  e: schedule('e', '2026-03-20T12:00:00.000Z')
} as unknown as CardScheduleMap;

describe('buildDueQueue', () => {
  it('holds due and new cards in library order, capped at the limit', () => {
    expect(buildDueQueue(cards, schedules, now).map(c => c.id)).toEqual([
      'a',
      'd',
      'f'
    ]);
    expect(buildDueQueue(cards, schedules, now, 2).map(c => c.id)).toEqual([
      'a',
      'd'
    ]);
  });

  it('leaves out the cards already answered in the session', () => {
    const queue = buildDueQueue(cards, schedules, now, 10, new Set(['a']));
    expect(queue.map(c => c.id)).toEqual(['d', 'f']);
  });

  it('is scoped by whichever cards the caller passes (one group)', () => {
    const group = cards.filter(c => ['a', 'b'].includes(c.id));
    expect(buildDueQueue(group, schedules, now).map(c => c.id)).toEqual(['a']);
  });
});

describe('buildAheadQueue', () => {
  it('takes only cards that are not due yet, soonest due first', () => {
    expect(buildAheadQueue(cards, schedules, now).map(c => c.id)).toEqual([
      'c',
      'b',
      'e'
    ]);
  });

  it('never includes due cards or cards without a schedule', () => {
    const ids = buildAheadQueue(cards, schedules, now).map(c => c.id);
    expect(ids).not.toContain('a');
    expect(ids).not.toContain('d');
    expect(ids).not.toContain('f');
  });

  it('respects the limit and the excluded ids', () => {
    expect(buildAheadQueue(cards, schedules, now, 2).map(c => c.id)).toEqual([
      'c',
      'b'
    ]);
    expect(
      buildAheadQueue(cards, schedules, now, 10, new Set(['c'])).map(c => c.id)
    ).toEqual(['b', 'e']);
  });

  it('is scoped by the cards passed in and does not mutate them', () => {
    const group = cards.filter(c => ['b', 'e'].includes(c.id));
    expect(buildAheadQueue(group, schedules, now).map(c => c.id)).toEqual([
      'b',
      'e'
    ]);
    expect(cards.map(c => c.id)).toEqual(['a', 'b', 'c', 'd', 'e', 'f']);
  });
});
