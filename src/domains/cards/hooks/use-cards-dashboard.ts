'use client';

import { useMemo, useState } from 'react';
import { INITIAL_CARDS, INITIAL_GROUPS } from '../data';
import { CARD_PARTS_OF_SPEECH } from '../card-create.schema';
import { isCardList, isGroupList } from '../library-validators';
import { cardsMessages } from '../messages';
import { isMastered } from '../scheduling/mastery';
import { buildDueQueue } from '../scheduling/progress';
import { isCardScheduleMap } from '../scheduling/validators';
import type { CardScheduleMap } from '../scheduling/types';
import type { CardGroup, VocabularyCard } from '../types';
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
  const [cards, setCards] = useTrackedBrowserState(
    'cards/library',
    INITIAL_CARDS,
    isCardList,
    cardChanges
  );
  const [groups, setGroups] = useTrackedBrowserState(
    'cards/groups',
    INITIAL_GROUPS,
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
  // Editor UI state: it only overlays the page on narrow screens.
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editorKey, setEditorKey] = useState(0);
  const [editorGroupId, setEditorGroupId] = useState<string | undefined>();
  const [editorReturnView, setEditorReturnView] =
    useState<GroupView>('overview');

  const now = new Date();
  const activeGroup = groups.find(group => group.id === activeGroupId);
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

  const activeGroupCards = activeGroup
    ? cards.filter(card => card.groupId === activeGroup.id)
    : [];
  const activeGroupStats = {
    dueCount: buildDueQueue(activeGroupCards, schedules, now, Infinity).length,
    masteredPercent: activeGroupCards.length
      ? Math.round(
          (activeGroupCards.filter(card => isMastered(schedules[card.id]))
            .length /
            activeGroupCards.length) *
            100
        )
      : 0
  };

  function openEditor() {
    setEditorReturnView(groupView);
    setEditorGroupId(activeGroup?.id);
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

  function createGroup(newGroup: CardGroup) {
    setGroups(currentGroups => [...currentGroups, newGroup]);
    setActiveGroupId(newGroup.id);
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
    activeGroupCards,
    activeGroupStats,
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
    createGroup,
    startGroupCreation,
    viewExistingCard
  };
}
