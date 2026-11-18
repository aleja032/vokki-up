import { describe, expect, it } from 'vitest';
import { INITIAL_CARDS } from '../data';
import { getExampleEs } from './example-es';

describe('getExampleEs for the starter cards', () => {
  it('translates every starter card that ships with the app', () => {
    for (const card of INITIAL_CARDS) {
      const spanish = getExampleEs(card);
      expect(spanish, card.term).toBeTruthy();
      expect(spanish, card.term).not.toBe(card.example);
    }
  });

  it('does not show a starter translation once the example was edited', () => {
    const [first] = INITIAL_CARDS;
    expect(getExampleEs({ ...first, example: 'A different sentence.' })).toBe(
      undefined
    );
  });
});
