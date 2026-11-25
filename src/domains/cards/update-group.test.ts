import { describe, expect, it } from 'vitest';
import { OTHERS_GROUP, OTHERS_GROUP_ID } from './delete-group';
import {
  buildGroupPatch,
  collectOtherGroupNames,
  updateGroupDetails
} from './update-group';
import type { CardGroup } from './types';

const work: CardGroup = {
  id: 'work',
  name: 'Trabajo',
  description: 'Reuniones, proyectos y oficina',
  tone: 'indigo'
};
const travel: CardGroup = {
  id: 'travel',
  name: 'Viajes',
  description: 'Moverte con confianza',
  tone: 'amber'
};
const groups = [work, travel, OTHERS_GROUP];

describe('updateGroupDetails', () => {
  it('renames one folder and leaves the others untouched', () => {
    const next = updateGroupDetails(groups, 'work', { name: 'Oficina' });
    expect(next).not.toBe(groups);
    expect(next.find(group => group.id === 'work')?.name).toBe('Oficina');
    expect(next[1]).toBe(travel);
    expect(next[2]).toBe(OTHERS_GROUP);
  });

  it('trims the new name', () => {
    const next = updateGroupDetails(groups, 'work', { name: '  Oficina  ' });
    expect(next[0]?.name).toBe('Oficina');
  });

  it('changes the tone and keeps the name and the description', () => {
    const next = updateGroupDetails(groups, 'travel', { tone: 'blue' });
    expect(next[1]).toEqual({ ...travel, tone: 'blue' });
  });

  it('changes name and tone together', () => {
    const next = updateGroupDetails(groups, 'work', {
      name: 'Oficina',
      tone: 'gray'
    });
    expect(next[0]).toMatchObject({ name: 'Oficina', tone: 'gray' });
  });

  it('rejects the name of another folder, ignoring case', () => {
    expect(updateGroupDetails(groups, 'work', { name: 'viajes' })).toBe(groups);
  });

  it('rejects an empty or too long name', () => {
    expect(updateGroupDetails(groups, 'work', { name: '   ' })).toBe(groups);
    expect(updateGroupDetails(groups, 'work', { name: 'a'.repeat(31) })).toBe(
      groups
    );
  });

  it('allows a folder to keep its own name with another case', () => {
    const next = updateGroupDetails(groups, 'work', { name: 'TRABAJO' });
    expect(next[0]?.name).toBe('TRABAJO');
  });

  it('returns the same list for an unknown folder or an empty patch', () => {
    expect(updateGroupDetails(groups, 'nope', { name: 'X' })).toBe(groups);
    expect(updateGroupDetails(groups, 'work', {})).toBe(groups);
    expect(updateGroupDetails(groups, 'work', { name: 'Trabajo' })).toBe(
      groups
    );
  });

  it('keeps the name of Otros (the catch-all) but lets its color change', () => {
    const renamed = updateGroupDetails(groups, OTHERS_GROUP_ID, {
      name: 'Varios'
    });
    expect(renamed).toBe(groups);
    const recolored = updateGroupDetails(groups, OTHERS_GROUP_ID, {
      name: 'Varios',
      tone: 'teal'
    });
    expect(recolored[2]).toEqual({ ...OTHERS_GROUP, tone: 'teal' });
  });

  it('rejects the reserved name Otros for any other folder', () => {
    expect(updateGroupDetails(groups, 'work', { name: 'otros' })).toBe(groups);
  });
});

describe('collectOtherGroupNames', () => {
  it('lists the stored and the displayed names of the other folders', () => {
    const names = collectOtherGroupNames(groups, 'work');
    expect(names).toContain('Viajes');
    expect(names).toContain('Otros');
    expect(names).not.toContain('Trabajo');
  });
});

describe('buildGroupPatch', () => {
  it('sends only what the user changed', () => {
    expect(buildGroupPatch(work, { name: 'Oficina', tone: 'indigo' })).toEqual({
      name: 'Oficina'
    });
    expect(buildGroupPatch(work, { name: 'Trabajo', tone: 'blue' })).toEqual({
      tone: 'blue'
    });
  });

  it('leaves a legacy stored tone alone until the user picks another color', () => {
    // amber is displayed as teal: keeping teal changes nothing
    expect(buildGroupPatch(travel, { name: 'Viajes', tone: 'teal' })).toEqual(
      {}
    );
    expect(buildGroupPatch(travel, { name: 'Viajes', tone: 'green' })).toEqual({
      tone: 'green'
    });
  });

  it('trims the name before comparing', () => {
    expect(
      buildGroupPatch(work, { name: '  Trabajo ', tone: 'indigo' })
    ).toEqual({});
  });
});
