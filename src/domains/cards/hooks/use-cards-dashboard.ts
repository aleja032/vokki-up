'use client';

import { useMemo, useState } from 'react';
import { CARD_PARTS_OF_SPEECH } from '../card-create.schema';
import { isCardList, isGroupList } from '../library-validators';
import { cardsMessages } from '../messages';
import { isMastered } from '../scheduling/mastery';
import { buildDueQueue } from '../scheduling/progress';
import { isCardScheduleMap } from '../scheduling/validators';
import type { CardScheduleMap } from '../scheduling/types';
import type { CardGroup, VocabularyCard } from '../types';
import {
  addCatalogEntries,
  createWordLibraryCardId,
  type WordLibraryEntry
} from '../word-library/catalog';
import { collectionChangeBuilder } from '@/lib/sync/change-builders';
import { useTrackedBrowserState } from '@/lib/sync/use-tracked-browser-state';
import { useBrowserState } from '@/lib/storage/use-browser-state';

const cardChanges = collectionChangeBuilder<VocabularyCard>('card');
const groupChanges = collectionChangeBuilder<CardGroup>('card-group');

export const ALL_GROUPS_ID = 'all';
const ALL_CATEGORIES = cardsMessages.overview.allCategories;
const CATEGORY_FILTERS = [ALL_CATEGORIES, ...CARD_PARTS_OF_SPEECH];

export type GroupView = 'overview' | 'new' | 'detail';

export function useCardsDashboard() {
  const [cards, setCards, areCardsLoaded] = useTrackedBrowserState(
    'cards/library',
    [],
    isCardList,
    cardChanges
  );
  const [groups, setGroups, areGroupsLoaded] = useTrackedBrowserState(
    'cards/groups',
    [],
    isGroupList,
    groupChanges
  );
  const [schedules] = useBrowserState<CardScheduleMap>(
    'cards/schedules',
    {},
    isCardScheduleMap
  );
  const [activeGroupId, setActiveGroupId] = useState(ALL_GROUPS_ID);
  const [activeCategory, setActiveCategory] = useState<string>(ALL_CATEGORIES);
  const [searchText, setSearchText] = useState('');
  const [groupView, setGroupView] = useState<GroupView>('overview');
  // The open group detail is independent from the library filter above.
  const [openGroupId, setOpenGroupId] = useState<string | undefined>();
  // Editor UI state: it only overlays the page on narrow screens.
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editorKey, setEditorKey] = useState(0);
  const [editorGroupId, setEditorGroupId] = useState<string | undefined>();
  const [editorReturnView, setEditorReturnView] =
    useState<GroupView>('overview');

  const now = new Date();
  const activeGroup = groups.find(group => group.id === activeGroupId);
  const openGroup = groups.find(group => group.id === openGroupId);
  const dueCount = buildDueQueue(cards, schedules, now).length;
  const existingTerms = useMemo(() => cards.map(card => card.term), [cards]);

  const groupTiles = groups.map(group => {
    const groupCards = cards.filter(card => card.groupId === group.id);
    return {
      group,
      cardCount: groupCards.length,
      dueCount: buildDueQueue(groupCards, schedules, now, Infinity).length
    };
  });

  const filteredCards = cards.filter(card => {
    const belongsToGroup =
      activeGroupId === ALL_GROUPS_ID || card.groupId === activeGroupId;
    const belongsToCategory =
      activeCategory === ALL_CATEGORIES || card.partOfSpeech === activeCategory;
    const query = searchText.trim().toLocaleLowerCase();
    const matchesSearch =
      !query ||
      [card.term, card.meaning, ...card.tags].some(value =>
        value.toLocaleLowerCase().includes(query)
      );
    return belongsToGroup && belongsToCategory && matchesSearch;
  });

  const openGroupCards = openGroup
    ? cards.filter(card => card.groupId === openGroup.id)
    : [];
  const openGroupStats = {
    dueCount: buildDueQueue(openGroupCards, schedules, now, Infinity).length,
    masteredPercent: openGroupCards.length
      ? Math.round(
          (openGroupCards.filter(card => isMastered(schedules[card.id]))
            .length /
            openGroupCards.length) *
            100
        )
      : 0
  };

  function openEditor() {
    setEditorReturnView(groupView);
    setEditorGroupId(groupView === 'detail' ? openGroup?.id : undefined);
    setEditorKey(key => key + 1);
    setIsEditorOpen(true);
    if (groupView === 'detail') setGroupView('overview');
  }

  function closeEditor() {
    setIsEditorOpen(false);
    setEditorKey(key => key + 1);
    setEditorGroupId(undefined);
    setGroupView(editorReturnView);
  }

  function saveCard(card: VocabularyCard) {
    setCards(currentCards => [card, ...currentCards]);
    setActiveGroupId(ALL_GROUPS_ID);
    setActiveCategory(ALL_CATEGORIES);
    setSearchText('');
    setIsEditorOpen(false);
    setEditorKey(key => key + 1);
    setEditorGroupId(undefined);
    setGroupView('overview');
  }

  // Cards created elsewhere (the AI capture inside the add hub).
  function addCards(newCards: VocabularyCard[]) {
    setCards(currentCards => [...newCards, ...currentCards]);
    setActiveGroupId(ALL_GROUPS_ID);
    setActiveCategory(ALL_CATEGORIES);
    setSearchText('');
  }

  function addWordLibraryEntries(
    entries: readonly WordLibraryEntry[],
    groupId: string
  ) {
    const idsByEntry = new Map(
      entries.map(entry => [entry.id, createWordLibraryCardId()])
    );
    const createId = (entry: WordLibraryEntry) => idsByEntry.get(entry.id)!;
    const result = addCatalogEntries(cards, entries, groupId, createId);
    setCards(
      currentCards =>
        addCatalogEntries(currentCards, entries, groupId, createId).cards
    );
    return result;
  }

  function createGroup(newGroup: CardGroup) {
    setGroups(currentGroups => [...currentGroups, newGroup]);
    setOpenGroupId(newGroup.id);
    setGroupView('detail');
  }

  function openGroupById(groupId: string) {
    setOpenGroupId(groupId);
    setGroupView('detail');
  }

  function startGroupCreation() {
    setIsEditorOpen(false);
    setGroupView('new');
  }

  function viewExistingCard(term: string) {
    setIsEditorOpen(false);
    setEditorKey(key => key + 1);
    setActiveGroupId(ALL_GROUPS_ID);
    setActiveCategory(ALL_CATEGORIES);
    setSearchText(term);
    setGroupView('overview');
  }

  return {
    cards,
    groups,
    schedules,
    now,
    dueCount,
    existingTerms,
    groupTiles,
    categories: CATEGORY_FILTERS,
    filteredCards,
    activeGroup,
    activeGroupId,
    openGroup,
    openGroupCards,
    openGroupStats,
    activeCategory,
    searchText,
    groupView,
    isEditorOpen,
    editorKey,
    editorGroupId,
    setActiveGroupId,
    setActiveCategory,
    setSearchText,
    setGroupView,
    openEditor,
    closeEditor,
    saveCard,
    addCards,
    addWordLibraryEntries,
    isLibraryReady: areCardsLoaded && areGroupsLoaded,
    createGroup,
    openGroupById,
    startGroupCreation,
    viewExistingCard
  };
}
