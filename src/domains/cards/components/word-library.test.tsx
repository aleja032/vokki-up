import { describe, expect, it } from 'vitest';
import { INITIAL_GROUPS } from '../data';
import { getDefaultGroupId } from './word-library';

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
});
