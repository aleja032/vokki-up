import { describe, expect, it } from 'vitest';
import { INITIAL_GROUPS } from '../data';
import type { VocabularyCard } from '../types';
import { wordLibraryCatalog } from './catalog';
import {
  addEntriesToDefaultGroups,
  ensureDefaultGroups,
  getDefaultGroupId
} from './default-groups';

function entriesOf(category: string, count: number) {
  return wordLibraryCatalog
    .filter(entry => entry.category === category)
    .slice(0, count);
}

describe('ensureDefaultGroups', () => {
  it('creates the missing default groups from the category name', () => {
    const result = ensureDefaultGroups([], ['Viajes', 'Trabajo']);

    expect(result.groups.map(group => group.name)).toEqual([
      'Viajes',
      'Trabajo'
    ]);
    expect(result.groupIdByCategory.get('Viajes')).toBe('travel');
    expect(result.groupIdByCategory.get('Trabajo')).toBe('work');
    expect(result.groups[0]).toMatchObject({
      id: 'travel',
      tone: 'amber',
      description: expect.any(String)
    });
  });

  it('never duplicates a group that already exists by id or by name', () => {
    const byId = ensureDefaultGroups(INITIAL_GROUPS, ['Viajes']);
    const renamed = [{ ...INITIAL_GROUPS[1], id: 'group-9' }];
    const byName = ensureDefaultGroups(renamed, ['Viajes']);

    expect(byId.groups).toBe(INITIAL_GROUPS);
    expect(byName.groups).toBe(renamed);
    expect(byName.groupIdByCategory.get('Viajes')).toBe('group-9');
  });

  it('creates each category group once', () => {
    const result = ensureDefaultGroups([], ['Viajes', 'Viajes']);

    expect(result.groups).toHaveLength(1);
  });
});

describe('addEntriesToDefaultGroups', () => {
  it('creates the groups and the cards when the user has neither', () => {
    const entries = [...entriesOf('Viajes', 2), ...entriesOf('Trabajo', 1)];
    const result = addEntriesToDefaultGroups(
      [],
      [],
      entries,
      entry => entry.id
    );

    expect(result.groups.map(group => group.id).sort()).toEqual([
      'travel',
      'work'
    ]);
    expect(result.cards).toHaveLength(3);
    expect(result.added).toHaveLength(3);
    expect(result.duplicates).toHaveLength(0);
    for (const card of result.cards) {
      expect(result.groups.some(group => group.id === card.groupId)).toBe(true);
    }
  });

  it('adds into an existing group without creating another one', () => {
    const entries = entriesOf('Viajes', 1);
    const result = addEntriesToDefaultGroups(
      INITIAL_GROUPS,
      [],
      entries,
      entry => entry.id
    );

    expect(result.groups).toBe(INITIAL_GROUPS);
    expect(result.cards[0].groupId).toBe('travel');
  });

  it('does not create a group for entries that are already cards', () => {
    const [entry] = entriesOf('Viajes', 1);
    const existing = [
      { id: 'c1', term: entry.term, groupId: 'x' } as VocabularyCard
    ];
    const result = addEntriesToDefaultGroups([], existing, [entry]);

    expect(result.groups).toEqual([]);
    expect(result.duplicates).toEqual([entry]);
    expect(result.cards).toEqual(existing);
  });
});

describe('getDefaultGroupId', () => {
  it('returns undefined when no matching group exists', () => {
    expect(getDefaultGroupId('Viajes', [])).toBeUndefined();
  });
});
