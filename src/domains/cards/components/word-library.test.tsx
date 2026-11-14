import { describe, expect, it } from 'vitest';
import { INITIAL_GROUPS } from '../data';
import {
  getDefaultGroupId,
  paginateWordLibraryEntries,
  WORD_LIBRARY_PAGE_SIZE
} from './word-library';

describe('word library default collections', () => {
  it('maps every catalog category to its matching default collection', () => {
    expect(getDefaultGroupId('Trabajo', INITIAL_GROUPS)).toBe('work');
    expect(getDefaultGroupId('Viajes', INITIAL_GROUPS)).toBe('travel');
    expect(getDefaultGroupId('Día a día', INITIAL_GROUPS)).toBe('daily');
    expect(getDefaultGroupId('Frases útiles', INITIAL_GROUPS)).toBe('phrases');
  });

  it('does not return a collection that is not present in the user groups', () => {
    expect(
      getDefaultGroupId(
        'Viajes',
        INITIAL_GROUPS.filter(group => group.id !== 'travel')
      )
    ).toBeUndefined();
  });

  it('routes by category name when a collection has a generated ID', () => {
    const generatedGroups = INITIAL_GROUPS.map((group, index) => ({
      ...group,
      id: `group-${index + 1}`
    }));

    expect(getDefaultGroupId('Trabajo', generatedGroups)).toBe('group-1');
    expect(getDefaultGroupId('Viajes', generatedGroups)).toBe('group-2');
    expect(getDefaultGroupId('Día a día', generatedGroups)).toBe('group-3');
    expect(getDefaultGroupId('Frases útiles', generatedGroups)).toBe('group-4');
  });

  it('paginates catalog entries without skipping or repeating entries', () => {
    const entries = Array.from({ length: 55 }, (_, index) => index);
    const firstPage = paginateWordLibraryEntries(entries, 1);
    const secondPage = paginateWordLibraryEntries(entries, 2);
    const thirdPage = paginateWordLibraryEntries(entries, 3);

    expect(WORD_LIBRARY_PAGE_SIZE).toBe(24);
    expect(firstPage).toHaveLength(24);
    expect(secondPage).toHaveLength(24);
    expect(thirdPage).toHaveLength(7);
    expect([...firstPage, ...secondPage, ...thirdPage]).toEqual(entries);
  });
});
