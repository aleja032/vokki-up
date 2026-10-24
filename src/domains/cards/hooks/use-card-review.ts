'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { INITIAL_CARDS, INITIAL_GROUPS } from '../data';
import { deriveCardsHomeSummary } from '../home-summary';
import type { CardRating, VocabularyCard } from '../types';
import { useBrowserState } from '@/lib/storage/use-browser-state';
import {
  buildDueQueue,
  getLocalDateKey,
  recordReviewEvent
} from '../scheduling/progress';
import { incrementalReviewScheduler } from '../scheduling/scheduler';
import type {
  CardSchedule,
  CardScheduleMap,
  ReviewSession
} from '../scheduling/types';
import { createCompletedReviewSession } from '../scheduling/review-sessions';
import {
  isCardGroupList,
  isCardScheduleMap,
  isReviewEventList,
  isReviewSessionList,
  isVocabularyCardList
} from '../scheduling/validators';
import { enqueueLocalSyncOperation } from '@/lib/sync/local-queue';
import { serializeSyncPayload } from '@/lib/sync/change-builders';
import { writeBrowserValue } from '@/lib/storage/browser-storage';
import { cardsMessages } from '../messages';

export type ReviewRating = Exclude<CardRating, 'hard'>;

export const REVIEW_RATINGS: ReviewRating[] = ['again', 'good', 'easy'];

const intervalMessages = cardsMessages.review.intervals;

function createReviewRecordId(): string {
  return (
    globalThis.crypto?.randomUUID?.() ??
    `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`
  );
}

export function getNextIntervalLabel(
  card: VocabularyCard,
  rating: CardRating,
  current: CardSchedule | undefined
): string {
  if (rating === 'again') return intervalMessages.again;
  const next = incrementalReviewScheduler.schedule({
    cardId: card.id,
    current,
    rating,
    reviewedAt: new Date()
  });
  if (next.intervalMinutes < 60) return intervalMessages.underHour;
  const days = Math.ceil(next.intervalMinutes / (60 * 24));
  return days === 1 ? intervalMessages.oneDay : intervalMessages.days(days);
}

export function useCardReview() {
  const [cards, , cardsLoaded] = useBrowserState(
    'cards/library',
    INITIAL_CARDS,
    isVocabularyCardList
  );
  const [, , groupsLoaded] = useBrowserState(
    'cards/groups',
    INITIAL_GROUPS,
    isCardGroupList
  );
  const [schedules, setSchedules, schedulesLoaded] =
    useBrowserState<CardScheduleMap>('cards/schedules', {}, isCardScheduleMap);
  const [reviewEvents, setReviewEvents, eventsLoaded] = useBrowserState(
    'cards/review-events',
    [],
    isReviewEventList
  );
  const [reviewSessions, setReviewSessions, sessionsLoaded] = useBrowserState<
    ReviewSession[]
  >('cards/review-sessions', [], isReviewSessionList);
  const [sessionCards, setSessionCards] = useState<VocabularyCard[]>([]);
  const [queue, setQueue] = useState<VocabularyCard[]>([]);
  const [requestedGroupId] = useState<string | null>(() =>
    typeof window === 'undefined'
      ? null
      : new URLSearchParams(window.location.search).get('groupId')
  );
  const repeatedCardIds = useRef(new Set<string>());
  const reviewSessionsRef = useRef(reviewSessions);
  useEffect(() => {
    reviewSessionsRef.current = reviewSessions;
  }, [reviewSessions]);
  const sessionStartedAtRef = useRef<number | null>(null);
  const handleRateRef = useRef<(rating: CardRating) => void>(() => undefined);
  const [index, setIndex] = useState(0);
  const [isSessionLoaded, setIsSessionLoaded] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);
  const [ratings, setRatings] = useState<Record<CardRating, number>>({
    again: 0,
    hard: 0,
    good: 0,
    easy: 0
  });
  const card: VocabularyCard | undefined = queue[index];

  useEffect(() => {
    if (
      isSessionLoaded ||
      !cardsLoaded ||
      !groupsLoaded ||
      !schedulesLoaded ||
      !eventsLoaded ||
      !sessionsLoaded
    )
      return;
    let isMounted = true;
    queueMicrotask(() => {
      if (!isMounted) return;
      const reviewCards = requestedGroupId
        ? cards.filter(item => item.groupId === requestedGroupId)
        : cards;
      const dueCards = buildDueQueue(reviewCards, schedules, new Date());
      setSessionCards(dueCards);
      setQueue(dueCards);
      setIsSessionLoaded(true);
    });
    return () => {
      isMounted = false;
    };
  }, [
    cards,
    cardsLoaded,
    eventsLoaded,
    groupsLoaded,
    isSessionLoaded,
    requestedGroupId,
    schedules,
    schedulesLoaded,
    sessionsLoaded
  ]);

  const handleRate = useCallback(
    (rating: CardRating) => {
      if (!card) return;
      if (sessionStartedAtRef.current === null)
        sessionStartedAtRef.current = Date.now();
      const reviewedAt = new Date();
      setRatings(current => ({ ...current, [rating]: current[rating] + 1 }));
      const schedule = incrementalReviewScheduler.schedule({
        cardId: card.id,
        current: schedules[card.id],
        rating,
        reviewedAt
      });
      setSchedules(current => ({ ...current, [card.id]: schedule }));
      enqueueLocalSyncOperation({
        entityType: 'card-schedule',
        operation: 'upsert',
        entityId: card.id,
        payload: serializeSyncPayload(schedule)
      });
      const reviewEvent = {
        id: createReviewRecordId(),
        cardId: card.id,
        rating,
        reviewedAt: reviewedAt.toISOString(),
        localDate: getLocalDateKey(reviewedAt)
      };
      const recorded = recordReviewEvent(reviewEvents, reviewEvent);
      setReviewEvents(recorded.events);
      enqueueLocalSyncOperation({
        entityType: 'card-review',
        operation: 'upsert',
        entityId: recorded.event.id,
        payload: serializeSyncPayload(recorded.event)
      });
      if (
        rating === 'again' &&
        index < queue.length - 1 &&
        !repeatedCardIds.current.has(card.id)
      ) {
        repeatedCardIds.current.add(card.id);
        setQueue(current => [...current, card]);
      }
      setIsRevealed(false);
      setIndex(current => current + 1);
    },
    [
      card,
      index,
      queue.length,
      reviewEvents,
      schedules,
      setReviewEvents,
      setSchedules
    ]
  );

  const finishReviewSession = useCallback(() => {
    const startedAt = sessionStartedAtRef.current;
    if (startedAt === null) return;

    const completed = createCompletedReviewSession({
      id: createReviewRecordId(),
      startAt: new Date(startedAt).toISOString(),
      endAt: new Date().toISOString()
    });
    sessionStartedAtRef.current = null;
    if (!completed) return;

    const nextSessions = [...reviewSessionsRef.current, completed];
    reviewSessionsRef.current = nextSessions;
    writeBrowserValue('cards/review-sessions', nextSessions);
    setReviewSessions(nextSessions);
  }, [setReviewSessions]);

  useEffect(() => {
    if (isSessionLoaded && sessionCards.length > 0 && index >= queue.length) {
      finishReviewSession();
    }
  }, [
    finishReviewSession,
    index,
    isSessionLoaded,
    queue.length,
    sessionCards.length
  ]);

  const finishReviewSessionRef = useRef(finishReviewSession);
  useEffect(() => {
    finishReviewSessionRef.current = finishReviewSession;
  }, [finishReviewSession]);
  useEffect(() => () => finishReviewSessionRef.current(), []);

  useEffect(() => {
    handleRateRef.current = handleRate;
  }, [handleRate]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const target = event.target;
      if (
        target instanceof HTMLElement &&
        (target.isContentEditable ||
          ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName))
      )
        return;
      if (event.code === 'Space' && !isRevealed && card) {
        event.preventDefault();
        setIsRevealed(true);
        return;
      }
      if (!isRevealed) return;
      if (event.key === '1') handleRateRef.current('again');
      if (event.key === '2') handleRateRef.current('good');
      if (event.key === '3') handleRateRef.current('easy');
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [card, isRevealed]);

  function handleRestart() {
    repeatedCardIds.current.clear();
    setQueue(sessionCards);
    setIndex(0);
    setRatings({ again: 0, hard: 0, good: 0, easy: 0 });
    setIsRevealed(false);
  }

  const total = queue.length;
  const reviewedCount =
    ratings.again + ratings.hard + ratings.good + ratings.easy;
  const status = !isSessionLoaded
    ? 'loading'
    : sessionCards.length === 0
      ? 'empty'
      : !card || index >= total
        ? 'complete'
        : 'reviewing';
  const position = status === 'reviewing' ? Math.min(index + 1, total) : total;
  const streakDays =
    status === 'complete'
      ? deriveCardsHomeSummary(cards, schedules, reviewEvents, reviewSessions)
          .streakDays
      : 0;

  return {
    status,
    card,
    position,
    total,
    progress: total ? Math.round((position / total) * 100) : 100,
    isRevealed,
    reveal: () => setIsRevealed(true),
    rate: handleRate,
    restart: handleRestart,
    getIntervalLabel: (rating: CardRating) =>
      card
        ? getNextIntervalLabel(card, rating, schedules[card.id])
        : intervalMessages.again,
    results: {
      reviewed: reviewedCount,
      hard: ratings.again + ratings.hard,
      good: ratings.good,
      easy: ratings.easy
    },
    streakDays
  };
}
