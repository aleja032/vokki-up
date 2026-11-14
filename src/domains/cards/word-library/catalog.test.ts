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
  it('contains 200 usable, distinct entries in each topic category', () => {
    expect(WORD_LIBRARY_CATEGORIES).toEqual([
      'Trabajo',
      'Viajes',
      'Día a día',
      'Frases útiles'
    ]);
    expect(wordLibraryCatalog).toHaveLength(800);
    expect(
      Object.fromEntries(
        WORD_LIBRARY_CATEGORIES.map(category => [
          category,
          wordLibraryCatalog.filter(item => item.category === category).length
        ])
      )
    ).toEqual({
      Trabajo: 200,
      Viajes: 200,
      'Día a día': 200,
      'Frases útiles': 200
    });
    expect(new Set(wordLibraryCatalog.map(item => item.id)).size).toBe(800);
    expect(
      new Set(wordLibraryCatalog.map(item => normalizeCatalogTerm(item.term)))
        .size
    ).toBe(800);
    const supportedPartsOfSpeech = [
      'Sustantivo',
      'Verbo',
      'Adjetivo',
      'Adverbio',
      'Expresión'
    ];
    const normalizePhrase = (value: string) =>
      value
        .normalize('NFKD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^\p{L}\p{N}\s]/gu, '')
        .replace(/\s+/g, ' ')
        .trim()
        .toLocaleLowerCase();

    for (const item of wordLibraryCatalog) {
      expect(item.term.trim(), item.id).not.toBe('');
      expect(item.meaning.trim(), item.id).not.toBe('');
      expect(item.example.trim(), item.id).not.toBe('');
      expect(item.phonetics, item.id).toMatch(/^\/.+\/$/);
      expect(supportedPartsOfSpeech, item.id).toContain(item.partOfSpeech);
      expect(item.tags.length, item.id).toBeGreaterThan(0);
      expect(normalizePhrase(item.example), item.id).toContain(
        normalizePhrase(item.term)
      );
    }
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
