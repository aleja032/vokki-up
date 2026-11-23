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
import { countCardStatuses } from '@/domains/cards/card-status';
import {
  buildDueQueue,
  getLocalDateKey
} from '@/domains/cards/scheduling/progress';
import { STARTER_CARDS } from '@/domains/cards/data';
import { HomeDashboard } from '@/domains/home/components/home-dashboard';
import type { HomeSummary } from '@/domains/home/home-summary.types';
import { deriveWorldProgress } from '@/lib/home/derive-worlds';
import {
  buildDueHand,
  buildMission,
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
      ? buildSummary()
      : null;

  function buildSummary(): HomeSummary {
    const dueHand = buildDueHand(
      buildDueQueue(cards, schedules, now, cards.length),
      schedules
    );
    const statusCounts = countCardStatuses(cards, schedules, now);
    return {
      ...deriveCardsHomeSummary(cards, schedules, events, reviewSessions),
      dueHand,
      mission: buildMission(
        events,
        Object.fromEntries(cards.map(card => [card.id, card.term])),
        dueHand,
        getLocalDateKey(now)
      ),
      upcoming: {
        today: statusCounts.due,
        week: statusCounts.week,
        safe: statusCounts.safe
      },
      weeklyAccuracy: deriveWeeklyAccuracy(events, now),
      worlds: deriveWorldProgress(
        wordLibraryCatalog,
        cards.map(card => card.term),
        normalizeCatalogTerm
      )
    };
  }

  return <HomeDashboard summary={summary} />;
}
