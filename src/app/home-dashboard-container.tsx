'use client';

import { INITIAL_CARDS } from '@/domains/cards/data';
import { deriveCardsHomeSummary } from '@/domains/cards/home-summary';
import type {
  CardScheduleMap,
  ReviewEvent,
  ReviewSession
} from '@/domains/cards/scheduling/types';
import {
  isCardScheduleMap,
  isReviewEventList,
  isReviewSessionList,
  isVocabularyCardList
} from '@/domains/cards/scheduling/validators';
import { HomeDashboard } from '@/domains/home/components/home-dashboard';
import { useBrowserState } from '@/lib/storage/use-browser-state';

export function HomeDashboardContainer() {
  const [cards, , cardsLoaded] = useBrowserState(
    'cards/library',
    INITIAL_CARDS,
    isVocabularyCardList
  );
  const [schedules, , schedulesLoaded] = useBrowserState<CardScheduleMap>(
    'cards/schedules',
    {},
    isCardScheduleMap
  );
  const [events, , eventsLoaded] = useBrowserState<ReviewEvent[]>(
    'cards/review-events',
    [],
    isReviewEventList
  );
  const [reviewSessions, , sessionsLoaded] = useBrowserState<ReviewSession[]>(
    'cards/review-sessions',
    [],
    isReviewSessionList
  );

  const summary =
    cardsLoaded && schedulesLoaded && eventsLoaded && sessionsLoaded
      ? deriveCardsHomeSummary(cards, schedules, events, reviewSessions)
      : null;

  return <HomeDashboard summary={summary} />;
}
