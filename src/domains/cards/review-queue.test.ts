import { describe, expect, it } from 'vitest';
import {
  requeueForAgain,
  resolveNextRound,
  summarizeRatings
} from './review-queue';

describe('requeueForAgain', () => {
  it('brings the card back after a few other cards', () => {
    const queue = ['a', 'b', 'c', 'd', 'e', 'f'];
    expect(requeueForAgain(queue, 0, 'a')).toEqual([
      'a',
      'b',
      'c',
      'd',
      'a',
      'e',
      'f'
    ]);
  });

  it('puts the card at the end when the round is nearly empty', () => {
    expect(requeueForAgain(['a', 'b'], 0, 'a')).toEqual(['a', 'b', 'a']);
  });

  it('repeats the last card too, so the round does not end on a miss', () => {
    expect(requeueForAgain(['a', 'b'], 1, 'b')).toEqual(['a', 'b', 'b']);
  });

  it('keeps the cards already answered untouched and does not mutate', () => {
    const queue = ['a', 'b', 'c', 'd', 'e'];
    const next = requeueForAgain(queue, 2, 'c', 1);
    expect(next).toEqual(['a', 'b', 'c', 'd', 'c', 'e']);
    expect(queue).toEqual(['a', 'b', 'c', 'd', 'e']);
  });
});

describe('summarizeRatings', () => {
  it('counts all four ratings separately', () => {
    expect(summarizeRatings({ again: 2, hard: 1, good: 3, easy: 4 })).toEqual({
      reviewed: 10,
      again: 2,
      hard: 1,
      good: 3,
      easy: 4
    });
  });
});

describe('resolveNextRound', () => {
  it('offers the rest of the due cards first, capped at the round size', () => {
    expect(
      resolveNextRound({ size: 10, dueRemaining: 25, aheadAvailable: 4 })
    ).toEqual({
      kind: 'due',
      count: 10,
      remaining: 25
    });
    expect(
      resolveNextRound({ size: 10, dueRemaining: 3, aheadAvailable: 4 })
    ).toEqual({
      kind: 'due',
      count: 3,
      remaining: 3
    });
  });

  it('offers studying ahead when nothing is due but cards are upcoming', () => {
    expect(
      resolveNextRound({ size: 20, dueRemaining: 0, aheadAvailable: 5 })
    ).toEqual({
      kind: 'ahead',
      count: 5
    });
  });

  it('offers nothing when neither exists', () => {
    expect(
      resolveNextRound({ size: 10, dueRemaining: 0, aheadAvailable: 0 })
    ).toBeNull();
  });
});
