'use client';

import { useMemo, useState } from 'react';
import { CARD_PARTS_OF_SPEECH } from '../card-create.schema';
import {
  ALL_CARD_STATUSES,
  countCardStatuses,
  matchesStatusFilter,
  type CardStatusFilter
} from '../card-status';
import { STARTER_CARDS, STARTER_GROUPS } from '../data';
import { canDeleteGroup, deleteGroupMovingCards } from '../delete-group';
import { getGroupDisplayName } from '../group-display';
import { isCardList, isGroupList } from '../library-validators';
import {
  collectOtherGroupNames,
  updateGroupDetails,
  type GroupPatch
} from '../update-group';
import { cardsMessages } from '../messages';
import { isMastered } from '../scheduling/mastery';
import { buildDueQueue } from '../scheduling/progress';
import { isCardScheduleMap, isReviewEventList } from '../scheduling/validators';
import type { CardScheduleMap, ReviewEvent } from '../scheduling/types';
import type { CardGroup, VocabularyCard } from '../types';
import {
  createWordLibraryCardId,
  type WordLibraryEntry
} from '../word-library/catalog';
import {
  addEntriesToDefaultGroups,
  ensureDefaultGroups
} from '../word-library/default-groups';
import { collectionChangeBuilder } from '@/lib/sync/change-builders';
import { enqueueLocalSyncOperation } from '@/lib/sync/local-queue';
import { useTrackedBrowserState } from '@/lib/sync/use-tracked-browser-state';
import { useBrowserState } from '@/lib/storage/use-browser-state';
import { removePersonalCards } from '../personal-card-removal';

const cardChanges = collectionChangeBuilder<VocabularyCard>('card');
const groupChanges = collectionChangeBuilder<CardGroup>('card-group');

export const ALL_GROUPS_ID = 'all';
const ALL_CATEGORIES = cardsMessages.overview.allCategories;
const CATEGORY_FILTERS = [ALL_CATEGORIES, ...CARD_PARTS_OF_SPEECH];

export type GroupView = 'overview' | 'new';

export function useCardsDashboard() {
  const [cards, setCards, areCardsLoaded] = useTrackedBrowserState(
    'cards/library',
    STARTER_CARDS,
    isCardList,
    cardChanges
  );
  const [groups, setGroups, areGroupsLoaded] = useTrackedBrowserState(
    'cards/groups',
    STARTER_GROUPS,
    isGroupList,
    groupChanges
  );
  const [schedules, setSchedules, areSchedulesLoaded] =
    useBrowserState<CardScheduleMap>('cards/schedules', {}, isCardScheduleMap);
  const [reviewEvents, setReviewEvents, areReviewEventsLoaded] =
    useBrowserState<ReviewEvent[]>(
      'cards/review-events',
      [],
      isReviewEventList
    );
  const [activeGroupId, setActiveGroupId] = useState(ALL_GROUPS_ID);
  const [activeCategory, setActiveCategory] = useState<string>(ALL_CATEGORIES);
  const [activeStatus, setActiveStatus] =
    useState<CardStatusFilter>(ALL_CARD_STATUSES);
  const [searchText, setSearchText] = useState('');
  const [groupSearchText, setGroupSearchText] = useState('');
  const [groupView, setGroupView] = useState<GroupView>('overview');
  // Editor UI state: it only overlays the page on narrow screens.
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editorKey, setEditorKey] = useState(0);
  const [editingCardId, setEditingCardId] = useState<string | undefined>();

  const now = new Date();
  const activeGroup = groups.find(group => group.id === activeGroupId);
  const dueCount = buildDueQueue(cards, schedules, now).length;
  const existingTerms = useMemo(() => cards.map(card => card.term), [cards]);
  const editingCard = cards.find(card => card.id === editingCardId);
  const editingExistingTerms = useMemo(
    () =>
      cards.filter(card => card.id !== editingCardId).map(card => card.term),
    [cards, editingCardId]
  );

  const groupTiles = groups.map(group => {
    const groupCards = cards.filter(card => card.groupId === group.id);
    return {
      group,
      cardCount: groupCards.length,
      dueCount: buildDueQueue(groupCards, schedules, now, Infinity).length
    };
  });

  const cardsInGroup = cards.filter(
    card => activeGroupId === ALL_GROUPS_ID || card.groupId === activeGroupId
  );
  const statusCounts = countCardStatuses(cardsInGroup, schedules, now);

  const filteredCards = cardsInGroup.filter(card => {
    const belongsToStatus = matchesStatusFilter(
      activeStatus,
      card.id,
      schedules,
      now
    );
    const belongsToCategory =
      activeCategory === ALL_CATEGORIES || card.partOfSpeech === activeCategory;
    const query = searchText.trim().toLocaleLowerCase();
    const matchesSearch =
      !query ||
      [card.term, card.meaning, ...card.tags].some(value =>
        value.toLocaleLowerCase().includes(query)
      );
    return belongsToStatus && belongsToCategory && matchesSearch;
  });

  // Quick stats and rules of the selected folder (none for "Todas"). The
  // review count is what one round holds, so the review button matches it.
  const activeGroupCards = activeGroup
    ? cards.filter(card => card.groupId === activeGroup.id)
    : [];
  const activeGroupStats = activeGroup
    ? {
        dueCount: buildDueQueue(activeGroupCards, schedules, now, Infinity)
          .length,
        masteredPercent: activeGroupCards.length
          ? Math.round(
              (activeGroupCards.filter(card => isMastered(schedules[card.id]))
                .length /
                activeGroupCards.length) *
                100
            )
          : 0,
        isDeletable: canDeleteGroup(activeGroup, activeGroupCards)
      }
    : undefined;
  const reviewGroup = activeGroup
    ? {
        id: activeGroup.id,
        name: getGroupDisplayName(activeGroup),
        dueCount: buildDueQueue(activeGroupCards, schedules, now).length
      }
    : undefined;

  function openEditor() {
    setEditorKey(key => key + 1);
    setIsEditorOpen(true);
  }

  function editCard(cardId: string) {
    setEditingCardId(cardId);
  }

  function closeCardEdit() {
    setEditingCardId(undefined);
  }

  // Replaces the edited card in place; its schedule and history stay untouched.
  function saveEditedCard(card: VocabularyCard) {
    setCards(currentCards =>
      currentCards.map(current => (current.id === card.id ? card : current))
    );
    setEditingCardId(undefined);
  }

  function closeEditor() {
    setIsEditorOpen(false);
    setEditorKey(key => key + 1);
  }

  function saveCard(card: VocabularyCard) {
    setCards(currentCards => [card, ...currentCards]);
    setActiveGroupId(ALL_GROUPS_ID);
    setActiveCategory(ALL_CATEGORIES);
    setActiveStatus(ALL_CARD_STATUSES);
    setSearchText('');
    setIsEditorOpen(false);
    setEditorKey(key => key + 1);
    setGroupView('overview');
  }

  // Cards created elsewhere (the AI capture inside the add hub).
  function addCards(newCards: VocabularyCard[]) {
    setCards(currentCards => [...newCards, ...currentCards]);
    setActiveGroupId(ALL_GROUPS_ID);
    setActiveCategory(ALL_CATEGORIES);
    setActiveStatus(ALL_CARD_STATUSES);
    setSearchText('');
  }

  function deleteCards(cardIds: readonly string[]) {
    if (!areCardsLoaded || !areSchedulesLoaded || !areReviewEventsLoaded)
      return;

    const currentData = { cards, schedules, reviewEvents };
    const nextData = removePersonalCards(currentData, cardIds);
    if (nextData === currentData) return;

    for (const cardId of cardIds) {
      if (!schedules[cardId]) continue;
      enqueueLocalSyncOperation({
        entityType: 'card-schedule',
        operation: 'delete',
        entityId: cardId
      });
    }
    setSchedules(nextData.schedules);
    setReviewEvents(nextData.reviewEvents);
    setCards(nextData.cards);
  }

  // Saves library entries into the default group of their category and
  // creates any default group the user does not have yet.
  function addWordLibraryEntries(entries: readonly WordLibraryEntry[]) {
    const idsByEntry = new Map(
      entries.map(entry => [entry.id, createWordLibraryCardId()])
    );
    const createId = (entry: WordLibraryEntry) => idsByEntry.get(entry.id)!;
    const result = addEntriesToDefaultGroups(groups, cards, entries, createId);
    if (result.added.length > 0) {
      const categories = result.added.map(entry => entry.category);
      setGroups(
        currentGroups => ensureDefaultGroups(currentGroups, categories).groups
      );
      setCards(
        currentCards =>
          addEntriesToDefaultGroups(groups, currentCards, entries, createId)
            .cards
      );
    }
    return result;
  }

  function createGroup(newGroup: CardGroup) {
    setGroups(currentGroups => [...currentGroups, newGroup]);
    setActiveGroupId(newGroup.id);
    setActiveCategory(ALL_CATEGORIES);
    setActiveStatus(ALL_CARD_STATUSES);
    setSearchText('');
    setGroupView('overview');
  }

  // Removes a group and moves its cards to "Otros". Both lists go through the
  // tracked setters, so the sync queue gets a delete for the group and upserts
  // for the moved cards and for a newly created "Otros".
  function deleteGroup(groupId: string) {
    if (!areCardsLoaded || !areGroupsLoaded) return;
    const result = deleteGroupMovingCards(groups, cards, groupId);
    if (result.groups === groups) return;
    setGroups(result.groups);
    if (result.cards !== cards) setCards(result.cards);
    if (activeGroupId === groupId) setActiveGroupId(ALL_GROUPS_ID);
    setGroupView('overview');
  }

  // Renames and/or recolors a group through the same tracked setter as create
  // and delete, so the sync queue gets one upsert and local storage follows.
  function updateGroup(groupId: string, patch: GroupPatch) {
    if (!areGroupsLoaded) return;
    const nextGroups = updateGroupDetails(groups, groupId, patch);
    if (nextGroups !== groups) setGroups(nextGroups);
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
    setActiveStatus(ALL_CARD_STATUSES);
    setSearchText(term);
    setGroupView('overview');
  }

  return {
    cards,
    groups,
    schedules,
    canDeleteCards:
      areCardsLoaded && areSchedulesLoaded && areReviewEventsLoaded,
    now,
    dueCount,
    existingTerms,
    editingCard,
    editingExistingTerms,
    groupTiles,
    categories: CATEGORY_FILTERS,
    filteredCards,
    statusCounts,
    activeGroup,
    activeGroupId,
    activeGroupStats,
    activeGroupOtherNames: activeGroup
      ? collectOtherGroupNames(groups, activeGroup.id)
      : [],
    reviewGroup,
    activeCategory,
    activeStatus,
    searchText,
    groupSearchText,
    groupView,
    isEditorOpen,
    editorKey,
    setActiveGroupId,
    setActiveCategory,
    setActiveStatus,
    setSearchText,
    setGroupSearchText,
    setGroupView,
    openEditor,
    editCard,
    closeCardEdit,
    saveEditedCard,
    closeEditor,
    saveCard,
    addCards,
    deleteCards,
    addWordLibraryEntries,
    isLibraryReady: areCardsLoaded && areGroupsLoaded,
    createGroup,
    updateGroup,
    deleteGroup,
    startGroupCreation,
    viewExistingCard
  };
}
