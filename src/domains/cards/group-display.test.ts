import { afterEach, describe, expect, it } from 'vitest';
import { setAppLanguage } from '@/lib/i18n/locale';
import { INITIAL_GROUPS } from './data';
import { OTHERS_GROUP } from './delete-group';
import {
  getGroupDisplayDescription,
  getGroupDisplayName
} from './group-display';

const work = INITIAL_GROUPS[0];

describe('seed group display', () => {
  afterEach(() => setAppLanguage('Español'));

  it('keeps Spanish when Spanish is selected', () => {
    expect(getGroupDisplayName(work)).toBe('Trabajo');
  });

  it('translates unmodified seed groups in English', () => {
    setAppLanguage('English');
    expect(getGroupDisplayName(work)).toBe('Work');
    expect(getGroupDisplayDescription(work)).toBe(
      'Meetings, projects, and office'
    );
    for (const group of INITIAL_GROUPS) {
      expect(getGroupDisplayName(group)).not.toBe(group.name);
      expect(getGroupDisplayDescription(group)).not.toBe(group.description);
    }
  });

  it('leaves renamed or user-created groups as typed', () => {
    setAppLanguage('English');
    expect(getGroupDisplayName({ ...work, name: 'Trabajo remoto' })).toBe(
      'Trabajo remoto'
    );
    expect(getGroupDisplayName({ ...work, id: 'g-9' })).toBe('Trabajo');
  });
});

describe('Otros display', () => {
  afterEach(() => setAppLanguage('Español'));

  it('shows Others in English only while unmodified', () => {
    setAppLanguage('English');
    expect(getGroupDisplayName(OTHERS_GROUP)).toBe('Others');
    expect(getGroupDisplayDescription(OTHERS_GROUP)).toBe(
      'Cards from deleted groups'
    );
    expect(getGroupDisplayName({ ...OTHERS_GROUP, name: 'Otros temas' })).toBe(
      'Otros temas'
    );
  });
});
