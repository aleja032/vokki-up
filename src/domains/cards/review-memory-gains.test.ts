import { describe, expect, it } from 'vitest';
import {
  recordMemoryGain,
  selectMemoryGains,
  type MemoryGain
} from './review-memory-gains';

const gain = (cardId: string, from: number, to: number): MemoryGain => ({
  cardId,
  term: cardId,
  from,
  to
});

describe('recordMemoryGain', () => {
  it('appends the first change of a card', () => {
    expect(recordMemoryGain([], gain('a', 1, 2))).toEqual([gain('a', 1, 2)]);
  });

  it('keeps the starting level and updates the final one on a repeat', () => {
    const afterAgain = recordMemoryGain([gain('a', 3, 0)], gain('a', 0, 1));
    expect(afterAgain).toEqual([gain('a', 3, 1)]);
  });
});

describe('selectMemoryGains', () => {
  it('keeps only cards that ended stronger than they started', () => {
    const selected = selectMemoryGains([
      gain('a', 1, 2),
      gain('b', 3, 1),
      gain('c', 5, 5)
    ]);
    expect(selected).toEqual([gain('a', 1, 2)]);
  });

  it('limits the list', () => {
    const many = ['a', 'b', 'c', 'd'].map(id => gain(id, 0, 1));
    expect(selectMemoryGains(many)).toHaveLength(3);
    expect(selectMemoryGains(many, 2)).toHaveLength(2);
  });
});
