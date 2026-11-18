import { INITIAL_GROUPS } from '../data';
import type { CardGroup, VocabularyCard } from '../types';
import {
  addCatalogEntries,
  normalizeCatalogTerm,
  type WordLibraryCategory,
  type WordLibraryEntry
} from './catalog';

const DEFAULT_GROUP_IDS: Record<WordLibraryCategory, string> = {
  Trabajo: 'work',
  Viajes: 'travel',
  'Día a día': 'daily',
  'Frases útiles': 'phrases'
};

export function getDefaultGroupId(
  category: WordLibraryCategory,
  groups: readonly CardGroup[]
) {
  const id = DEFAULT_GROUP_IDS[category];
  const matchingName = groups.find(group => group.name === category);
  if (matchingName) return matchingName.id;
  return groups.some(group => group.id === id) ? id : undefined;
}

function createDefaultGroup(category: WordLibraryCategory): CardGroup {
  const id = DEFAULT_GROUP_IDS[category];
  const template = INITIAL_GROUPS.find(group => group.id === id);
  return {
    id,
    name: category,
    description: template?.description ?? '',
    tone: template?.tone ?? 'indigo'
  };
}

// Returns the groups with every missing category group appended. The same
// array comes back when nothing is missing so callers can skip the update.
export function ensureDefaultGroups(
  groups: CardGroup[],
  categories: readonly WordLibraryCategory[]
) {
  let nextGroups = groups;
  const groupIdByCategory = new Map<WordLibraryCategory, string>();

  for (const category of categories) {
    if (groupIdByCategory.has(category)) continue;
    const existingId = getDefaultGroupId(category, nextGroups);
    if (existingId) {
      groupIdByCategory.set(category, existingId);
      continue;
    }
    const created = createDefaultGroup(category);
    nextGroups = [...nextGroups, created];
    groupIdByCategory.set(category, created.id);
  }

  return { groups: nextGroups, groupIdByCategory };
}

// Adds catalog entries to the default group of their category, creating the
// group when the user does not have it yet. Groups are only created for
// entries that will actually become cards.
export function addEntriesToDefaultGroups(
  currentGroups: CardGroup[],
  currentCards: readonly VocabularyCard[],
  entries: readonly WordLibraryEntry[],
  createId?: (entry: WordLibraryEntry) => string
) {
  const knownTerms = new Set(
    currentCards.map(card => normalizeCatalogTerm(card.term))
  );
  const addable = entries.filter(
    entry => !knownTerms.has(normalizeCatalogTerm(entry.term))
  );
  const { groups, groupIdByCategory } = ensureDefaultGroups(
    currentGroups,
    addable.map(entry => entry.category)
  );

  let cards = [...currentCards];
  const added: WordLibraryEntry[] = [];
  const duplicates: WordLibraryEntry[] = [];
  for (const [category, groupId] of groupIdByCategory) {
    const categoryEntries = entries.filter(
      entry => entry.category === category
    );
    const result = addCatalogEntries(cards, categoryEntries, groupId, createId);
    cards = result.cards;
    added.push(...result.added);
    duplicates.push(...result.duplicates);
  }
  // Entries whose category produced no group are already-owned duplicates.
  for (const entry of entries) {
    if (!groupIdByCategory.has(entry.category)) duplicates.push(entry);
  }

  return { groups, cards, added, duplicates };
}
