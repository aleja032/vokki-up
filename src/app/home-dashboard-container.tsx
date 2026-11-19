'use client';

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
import {
  normalizeCatalogTerm,
  wordLibraryCatalog
} from '@/domains/cards/word-library/catalog';
import { buildDueQueue } from '@/domains/cards/scheduling/progress';
import { STARTER_CARDS } from '@/domains/cards/data';
import { HomeDashboard } from '@/domains/home/components/home-dashboard';
import type { HomeSummary } from '@/domains/home/home-summary.types';
import { deriveWorldProgress } from '@/lib/home/derive-worlds';
import {
  buildDueHand,
  deriveWeeklyAccuracy
} from '@/lib/home/build-home-extras';
import { useBrowserState } from '@/lib/storage/use-browser-state';

export function HomeDashboardContainer() {
  const [cards, , cardsLoaded] = useBrowserState(
    'cards/library',
    STARTER_CARDS,
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

  const now = new Date();
  const summary: HomeSummary | null =
    cardsLoaded && schedulesLoaded && eventsLoaded && sessionsLoaded
      ? {
          ...deriveCardsHomeSummary(cards, schedules, events, reviewSessions),
          dueHand: buildDueHand(
            buildDueQueue(cards, schedules, now, cards.length),
            schedules
          ),
          weeklyAccuracy: deriveWeeklyAccuracy(events, now),
          worlds: deriveWorldProgress(
            wordLibraryCatalog,
            cards.map(card => card.term),
            normalizeCatalogTerm
          )
        }
      : null;

  return <HomeDashboard summary={summary} />;
}
