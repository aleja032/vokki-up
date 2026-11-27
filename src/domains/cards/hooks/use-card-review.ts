'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { STARTER_CARDS, STARTER_GROUPS } from '../data';
import { deriveCardsHomeSummary } from '../home-summary';
import type { CardRating, VocabularyCard } from '../types';
import { useBrowserState } from '@/lib/storage/use-browser-state';
import {
  buildAheadQueue,
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
import { resolveReviewExit } from '../review-exit';
import { parseReviewParams, type ReviewMode } from '../review-params';
import type { RoundSize } from '../review-round-size';
import { getCardMemory } from '../card-memory';
import {
  requeueForAgain,
  resolveNextRound,
  summarizeRatings
} from '../review-queue';
import {
  recordMemoryGain,
  selectMemoryGains,
  type MemoryGain
} from '../review-memory-gains';

export const REVIEW_RATINGS: CardRating[] = ['again', 'hard', 'good', 'easy'];

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

function buildRoundQueue(
  mode: ReviewMode,
  cards: VocabularyCard[],
  schedules: CardScheduleMap,
  now: Date,
  size: RoundSize,
  excludeIds?: ReadonlySet<string>
): VocabularyCard[] {
  return mode === 'ahead'
    ? buildAheadQueue(cards, schedules, now, size, excludeIds)
    : buildDueQueue(cards, schedules, now, size, excludeIds);
}

export function useCardReview() {
  const [cards, , cardsLoaded] = useBrowserState(
    'cards/library',
    STARTER_CARDS,
    isVocabularyCardList
  );
  const [, , groupsLoaded] = useBrowserState(
    'cards/groups',
    STARTER_GROUPS,
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
  const [reviewParams] = useState(() =>
    parseReviewParams(
      typeof window === 'undefined' ? '' : window.location.search
    )
  );
  const requestedGroupId = reviewParams.groupId;
  const roundSize = reviewParams.size;
  const [reviewExit] = useState(() => resolveReviewExit(reviewParams.from));
  const [mode, setMode] = useState<ReviewMode>(reviewParams.mode);
  // Every card put in a round of this visit: follow-up rounds skip them.
  const [answeredIds, setAnsweredIds] = useState<ReadonlySet<string>>(
    () => new Set()
  );
  const scopeCards = useMemo(
    () =>
      requestedGroupId
        ? cards.filter(item => item.groupId === requestedGroupId)
        : cards,
    [cards, requestedGroupId]
  );
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
  const [combo, setCombo] = useState({ current: 0, best: 0 });
  const [memoryGains, setMemoryGains] = useState<MemoryGain[]>([]);
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
      const firstRound = buildRoundQueue(
        mode,
        scopeCards,
        schedules,
        new Date(),
        roundSize
      );
      setSessionCards(firstRound);
      setQueue(firstRound);
      setAnsweredIds(new Set(firstRound.map(item => item.id)));
      setIsSessionLoaded(true);
    });
    return () => {
      isMounted = false;
    };
  }, [
    cardsLoaded,
    eventsLoaded,
    groupsLoaded,
    isSessionLoaded,
    mode,
    roundSize,
    schedules,
    schedulesLoaded,
    scopeCards,
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
      const isRecalled = rating === 'good' || rating === 'easy';
      setCombo(current => {
        const next = isRecalled ? current.current + 1 : 0;
        return { current: next, best: Math.max(current.best, next) };
      });
      setMemoryGains(current =>
        recordMemoryGain(current, {
          cardId: card.id,
          term: card.term,
          from: getCardMemory(schedules[card.id]).level,
          to: getCardMemory(schedule).level
        })
      );
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
      if (rating === 'again')
        setQueue(current => requeueForAgain(current, index, card));
      setIsRevealed(false);
      setIndex(current => current + 1);
    },
    [card, index, reviewEvents, schedules, setReviewEvents, setSchedules]
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
      if (event.key === '2') handleRateRef.current('hard');
      if (event.key === '3') handleRateRef.current('good');
      if (event.key === '4') handleRateRef.current('easy');
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [card, isRevealed]);

  function handleRestart() {
    setQueue(sessionCards);
    setIndex(0);
    setRatings({ again: 0, hard: 0, good: 0, easy: 0 });
    setCombo({ current: 0, best: 0 });
    setMemoryGains([]);
    setIsRevealed(false);
  }

  // Next round, in place: a fresh queue of cards not yet seen this visit, with
  // the round tallies reset. No navigation, so nothing reloads.
  function handleStartNextRound() {
    if (!nextRound) return;
    const nextMode: ReviewMode = nextRound.kind === 'ahead' ? 'ahead' : 'due';
    const next = buildRoundQueue(
      nextMode,
      scopeCards,
      schedules,
      new Date(),
      roundSize,
      answeredIds
    );
    if (next.length === 0) return;
    setMode(nextMode);
    setSessionCards(next);
    setQueue(next);
    setAnsweredIds(current => new Set([...current, ...next.map(c => c.id)]));
    setIndex(0);
    setRatings({ again: 0, hard: 0, good: 0, easy: 0 });
    setCombo({ current: 0, best: 0 });
    setMemoryGains([]);
    setIsRevealed(false);
  }

  const total = queue.length;
  const status = !isSessionLoaded
    ? 'loading'
    : sessionCards.length === 0
      ? 'empty'
      : !card || index >= total
        ? 'complete'
        : 'reviewing';
  const now = new Date();
  const nextRound =
    status !== 'complete'
      ? null
      : resolveNextRound({
          size: roundSize,
          dueRemaining: buildDueQueue(
            scopeCards,
            schedules,
            now,
            Infinity,
            answeredIds
          ).length,
          aheadAvailable: buildAheadQueue(
            scopeCards,
            schedules,
            now,
            Infinity,
            answeredIds
          ).length
        });
  const position = status === 'reviewing' ? Math.min(index + 1, total) : total;
  const streakDays =
    status === 'complete'
      ? deriveCardsHomeSummary(cards, schedules, reviewEvents, reviewSessions)
          .streakDays
      : 0;

  return {
    status,
    reviewExit,
    isAhead: mode === 'ahead',
    nextRound,
    startNextRound: handleStartNextRound,
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
    memory: card ? getCardMemory(schedules[card.id]) : undefined,
    combo: combo.current,
    bestCombo: combo.best,
    memoryGains: selectMemoryGains(memoryGains),
    results: summarizeRatings(ratings),
    streakDays
  };
}
