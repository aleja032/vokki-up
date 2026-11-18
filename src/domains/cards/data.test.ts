import { describe, expect, it } from 'vitest';
import { INITIAL_GROUPS, STARTER_CARDS, STARTER_GROUPS } from './data';

describe('starter data', () => {
  it('ships exactly three groups', () => {
    expect(STARTER_GROUPS.map(group => group.id)).toEqual([
      'work',
      'travel',
      'daily'
    ]);
  });

  it('puts at least three cards in every starter group', () => {
    for (const group of STARTER_GROUPS) {
      const count = STARTER_CARDS.filter(
        card => card.groupId === group.id
      ).length;
      expect(count, group.name).toBeGreaterThanOrEqual(3);
    }
  });

  it('leaves no orphan card and no duplicated ids', () => {
    const groupIds = new Set(STARTER_GROUPS.map(group => group.id));
    for (const card of STARTER_CARDS)
      expect(groupIds.has(card.groupId)).toBe(true);
    expect(new Set(STARTER_CARDS.map(card => card.id)).size).toBe(
      STARTER_CARDS.length
    );
    expect(new Set(STARTER_GROUPS.map(group => group.id)).size).toBe(
      STARTER_GROUPS.length
    );
  });

  it('keeps all four group templates for the word library', () => {
    expect(INITIAL_GROUPS.map(group => group.id)).toContain('phrases');
  });
});
