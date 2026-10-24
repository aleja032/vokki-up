import { INITIAL_CARDS } from './data';
import {
  buildDueQueue,
  deriveDailyCreditCount,
  getLocalDateKey
} from './scheduling/progress';
import { isMastered } from './scheduling/mastery';
import { getWeeklyStudyMinutes } from './scheduling/review-sessions';
import type {
  CardScheduleMap,
  ReviewEvent,
  ReviewSession
} from './scheduling/types';

export type CardsWeeklyActivity = {
  day: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
  isToday: boolean;
};

export type CardsHomeSummary = {
  totalDue: number;
  newCount: number;
  pendingCount: number;
  completed: number;
  streakDays: number;
  wordsSeen: number;
  masteredWords: number;
  weeklyMinutes: number;
  weeklyActivity: CardsWeeklyActivity[];
};

export function deriveCardsHomeSummary(
  cards: typeof INITIAL_CARDS,
  schedules: CardScheduleMap,
  events: ReviewEvent[],
  reviewSessions: ReviewSession[],
  today: Date = new Date()
): CardsHomeSummary {
  const todayKey = getLocalDateKey(today);
  const completed = deriveDailyCreditCount(events, todayKey);
  const dueCards = buildDueQueue(cards, schedules, today, cards.length);
  const newCount = dueCards.filter(card => !schedules[card.id]).length;
  const totalDue = dueCards.length;
  const weeklyActivity: CardsWeeklyActivity[] = Array.from(
    { length: 7 },
    (_, index) => {
      const date = new Date(today);
      date.setDate(today.getDate() - (6 - index));
      const localDate = getLocalDateKey(date);
      const count = deriveDailyCreditCount(events, localDate);
      const level: CardsWeeklyActivity['level'] =
        count === 0 ? 0 : count < 5 ? 1 : count < 12 ? 2 : count < 20 ? 3 : 4;
      const weekday = date
        .toLocaleDateString('es', { weekday: 'short' })
        .replace('.', '');

      return {
        day: weekday.charAt(0).toLocaleUpperCase() + weekday.slice(1),
        count,
        level,
        isToday: localDate === todayKey
      };
    }
  );

  return {
    totalDue,
    newCount,
    pendingCount: totalDue - newCount,
    completed,
    streakDays: deriveCurrentStreak(events, today),
    wordsSeen: new Set(events.map(event => event.cardId)).size,
    masteredWords: cards.filter(card => isMastered(schedules[card.id])).length,
    weeklyMinutes: getWeeklyStudyMinutes(reviewSessions, today),
    weeklyActivity
  };
}

function deriveCurrentStreak(events: ReviewEvent[], today: Date): number {
  const activeDays = new Set(
    events.filter(event => event.earnsDailyCredit).map(event => event.localDate)
  );
  const cursor = new Date(today);
  if (!activeDays.has(getLocalDateKey(cursor)))
    cursor.setDate(cursor.getDate() - 1);

  let streak = 0;
  while (activeDays.has(getLocalDateKey(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}
