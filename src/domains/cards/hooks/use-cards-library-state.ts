'use client';

import { INITIAL_CARDS, INITIAL_GROUPS } from '../data';
import { isCardList, isGroupList } from '../library-validators';
import { createCapturedCardsLibrary } from '../persistence/captured-cards';
import type { VocabularyCard } from '../types';
import { collectionChangeBuilder } from '@/lib/sync/change-builders';
import { useTrackedBrowserState } from '@/lib/sync/use-tracked-browser-state';

const cardChanges = collectionChangeBuilder<VocabularyCard>('card');

/**
 * Card library for screens outside the cards dashboard (the full-page AI
 * capture): the same storage keys the dashboard uses.
 */
export function useCardsLibraryState() {
  const [, setCards, areCardsLoaded] = useTrackedBrowserState(
    'cards/library',
    INITIAL_CARDS,
    isCardList,
    cardChanges
  );
  const [groups, , areGroupsLoaded] = useTrackedBrowserState(
    'cards/groups',
    INITIAL_GROUPS,
    isGroupList,
    () => []
  );
  return createCapturedCardsLibrary({
    groups,
    isReady: areCardsLoaded && areGroupsLoaded,
    addCards: cards => setCards(current => [...cards, ...current])
  });
}
