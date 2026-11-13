import { describe, expect, it } from 'vitest';
import {
  addCatalogEntries,
  filterCatalogEntries,
  normalizeCatalogTerm,
  WORD_LIBRARY_CATEGORIES,
  wordLibraryCatalog,
  type WordLibraryEntry
} from './catalog';
import type { VocabularyCard } from '../types';

const baseCard: VocabularyCard = {
  id: 'existing-1',
  term: 'Follow   Up ',
  meaning: 'dar seguimiento',
  phonetics: '',
  example: '',
  partOfSpeech: 'Expresión',
  groupId: 'work',
  tags: []
};

const entry: WordLibraryEntry = {
  id: 'follow-up',
  term: 'follow up',
  meaning: 'dar seguimiento',
  phonetics: '/ˈfɑː.loʊ ʌp/',
  example: 'I will follow up with you tomorrow.',
  partOfSpeech: 'Expresión',
  category: 'Trabajo',
  tags: ['work', 'communication']
};

describe('word library catalog', () => {
  it('starts with a small representative fixture across the four categories', () => {
    expect(WORD_LIBRARY_CATEGORIES).toEqual([
      'Trabajo',
      'Viajes',
      'Día a día',
      'Frases útiles'
    ]);
    expect(wordLibraryCatalog.length).toBeGreaterThanOrEqual(4);
    expect(new Set(wordLibraryCatalog.map(item => item.category))).toEqual(
      new Set(WORD_LIBRARY_CATEGORIES)
    );
  });

  it('filters by category and searches term, meaning, example, and tags', () => {
    expect(
      filterCatalogEntries(wordLibraryCatalog, 'Viajes', '').every(
        item => item.category === 'Viajes'
      )
    ).toBe(true);
    expect(
      filterCatalogEntries([entry], 'Todas', 'SEGUIMIENTO').map(item => item.id)
    ).toEqual(['follow-up']);
    expect(
      filterCatalogEntries([entry], 'Todas', 'communication').map(
        item => item.id
      )
    ).toEqual(['follow-up']);
  });

  it('adds entries to the selected group and skips normalized duplicates', () => {
    const result = addCatalogEntries(
      [baseCard],
      [entry],
      'travel',
      () => 'new-id'
    );

    expect(result.added).toEqual([]);
    expect(result.duplicates).toEqual([entry]);
    expect(result.cards).toEqual([baseCard]);

    const fresh = { ...entry, id: 'check-in', term: 'check in' };
    const added = addCatalogEntries([], [fresh], 'travel', () => 'fresh-id');
    expect(added.added).toHaveLength(1);
    expect(added.cards[0]).toMatchObject({
      id: 'fresh-id',
      term: 'check in',
      groupId: 'travel',
      tags: ['work', 'communication', 'Trabajo']
    });
    expect(normalizeCatalogTerm('  Follow   Up  ')).toBe('follow up');
  });
});
