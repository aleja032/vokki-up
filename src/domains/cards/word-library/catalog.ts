import type { VocabularyCard } from '../types';

export const WORD_LIBRARY_CATEGORIES = [
  'Trabajo',
  'Viajes',
  'Día a día',
  'Frases útiles'
] as const;

export type WordLibraryCategory = (typeof WORD_LIBRARY_CATEGORIES)[number];

/** Static entries are deliberately kept separate from the user's card library. */
export type WordLibraryEntry = {
  id: string;
  term: string;
  meaning: string;
  phonetics: string;
  example: string;
  partOfSpeech: string;
  category: WordLibraryCategory;
  tags: string[];
};

/** A representative seed; WL-02 will expand this catalog to its full size. */
export const wordLibraryCatalog: readonly WordLibraryEntry[] = [
  {
    id: 'follow-up',
    term: 'follow up',
    meaning: 'dar seguimiento',
    phonetics: '/ˈfɑː.loʊ ʌp/',
    example: 'I will follow up with you tomorrow.',
    partOfSpeech: 'Expresión',
    category: 'Trabajo',
    tags: ['work', 'communication']
  },
  {
    id: 'boarding-pass',
    term: 'boarding pass',
    meaning: 'tarjeta de embarque',
    phonetics: '/ˈbɔːr.dɪŋ pæs/',
    example: 'Please have your boarding pass ready.',
    partOfSpeech: 'Sustantivo',
    category: 'Viajes',
    tags: ['airport', 'travel']
  },
  {
    id: 'run-errands',
    term: 'run errands',
    meaning: 'hacer diligencias',
    phonetics: '/rʌn ˈer.əndz/',
    example: 'I need to run errands after work.',
    partOfSpeech: 'Expresión',
    category: 'Día a día',
    tags: ['routine', 'chores']
  },
  {
    id: 'by-the-way',
    term: 'by the way',
    meaning: 'a propósito',
    phonetics: '/baɪ ðə weɪ/',
    example: 'By the way, did you get my message?',
    partOfSpeech: 'Expresión',
    category: 'Frases útiles',
    tags: ['conversation', 'phrase']
  }
];

export const ALL_WORD_LIBRARY_CATEGORIES = 'Todas';

function normalizeSearchValue(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase();
}

export function normalizeCatalogTerm(value: string) {
  return value
    .normalize('NFKC')
    .trim()
    .replace(/\s+/g, ' ')
    .toLocaleLowerCase();
}

export function filterCatalogEntries(
  entries: readonly WordLibraryEntry[],
  category: string,
  searchText: string
) {
  const query = normalizeSearchValue(searchText.trim());

  return entries.filter(entry => {
    const matchesCategory =
      category === ALL_WORD_LIBRARY_CATEGORIES || entry.category === category;
    const matchesSearch =
      !query ||
      [
        entry.term,
        entry.meaning,
        entry.example,
        entry.category,
        ...entry.tags
      ].some(value => normalizeSearchValue(value).includes(query));

    return matchesCategory && matchesSearch;
  });
}

export type CatalogAddResult = {
  cards: VocabularyCard[];
  added: WordLibraryEntry[];
  duplicates: WordLibraryEntry[];
};

export function createWordLibraryCardId() {
  return (
    globalThis.crypto?.randomUUID?.() ??
    `${Date.now()}-${Math.random().toString(36).slice(2)}`
  );
}

export function addCatalogEntries(
  currentCards: readonly VocabularyCard[],
  entries: readonly WordLibraryEntry[],
  groupId: string,
  createId: (entry: WordLibraryEntry) => string = createWordLibraryCardId
): CatalogAddResult {
  const cards = [...currentCards];
  const knownTerms = new Set(
    currentCards.map(card => normalizeCatalogTerm(card.term))
  );
  const added: WordLibraryEntry[] = [];
  const duplicates: WordLibraryEntry[] = [];

  for (const entry of entries) {
    const term = normalizeCatalogTerm(entry.term);
    if (knownTerms.has(term)) {
      duplicates.push(entry);
      continue;
    }

    knownTerms.add(term);
    added.push(entry);
    cards.unshift({
      id: createId(entry),
      term: entry.term,
      meaning: entry.meaning,
      phonetics: entry.phonetics,
      example: entry.example,
      partOfSpeech: entry.partOfSpeech,
      groupId,
      tags: [...entry.tags, entry.category]
    });
  }

  return { cards, added, duplicates };
}
