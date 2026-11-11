import type { CardGroup, CardRating, VocabularyCard } from '../types';
import type {
  CardSchedule,
  CardScheduleMap,
  ReviewEvent,
  ReviewSession
} from './types';

export function isVocabularyCardList(
  value: unknown
): value is VocabularyCard[] {
  return (
    Array.isArray(value) &&
    value.every(
      card =>
        isRecord(card) &&
        typeof card.id === 'string' &&
        typeof card.term === 'string' &&
        typeof card.meaning === 'string' &&
        typeof card.phonetics === 'string' &&
        typeof card.example === 'string' &&
        typeof card.partOfSpeech === 'string' &&
        typeof card.groupId === 'string' &&
        Array.isArray(card.tags) &&
        card.tags.every(tag => typeof tag === 'string')
    )
  );
}

export function isCardGroupList(value: unknown): value is CardGroup[] {
  return (
    Array.isArray(value) &&
    value.every(
      group =>
        isRecord(group) &&
        typeof group.id === 'string' &&
        typeof group.name === 'string' &&
        typeof group.description === 'string' &&
        ['indigo', 'amber', 'green', 'blue'].includes(String(group.tone))
    )
  );
}

export function isCardScheduleMap(value: unknown): value is CardScheduleMap {
  return (
    isRecord(value) &&
    Object.entries(value).every(
      ([cardId, schedule]) =>
        isCardSchedule(schedule) && schedule.cardId === cardId
    )
  );
}

export function isReviewSessionList(value: unknown): value is ReviewSession[] {
  return (
    Array.isArray(value) &&
    value.every(
      session =>
        isRecord(session) &&
        typeof session.id === 'string' &&
        isTimestamp(session.startAt) &&
        isTimestamp(session.endAt) &&
        Date.parse(session.endAt) >= Date.parse(session.startAt) &&
        typeof session.durationMs === 'number' &&
        Number.isFinite(session.durationMs) &&
        session.durationMs ===
          Date.parse(session.endAt) - Date.parse(session.startAt) &&
        typeof session.durationMinutes === 'number' &&
        Number.isFinite(session.durationMinutes) &&
        session.durationMinutes === session.durationMs / 60_000
    )
  );
}

export function isReviewEventList(value: unknown): value is ReviewEvent[] {
  return (
    Array.isArray(value) &&
    value.every(
      event =>
        isRecord(event) &&
        typeof event.id === 'string' &&
        typeof event.cardId === 'string' &&
        isCardRating(event.rating) &&
        isTimestamp(event.reviewedAt) &&
        typeof event.localDate === 'string' &&
        /^\d{4}-\d{2}-\d{2}$/.test(event.localDate) &&
        typeof event.earnsDailyCredit === 'boolean'
    )
  );
}

function isCardSchedule(value: unknown): value is CardSchedule {
  return (
    isRecord(value) &&
    typeof value.cardId === 'string' &&
    typeof value.repetitions === 'number' &&
    Number.isInteger(value.repetitions) &&
    value.repetitions >= 0 &&
    typeof value.intervalMinutes === 'number' &&
    Number.isFinite(value.intervalMinutes) &&
    value.intervalMinutes > 0 &&
    isTimestamp(value.dueAt) &&
    isTimestamp(value.lastReviewedAt) &&
    isCardRating(value.lastRating)
  );
}

function isCardRating(value: unknown): value is CardRating {
  return (
    value === 'again' ||
    value === 'hard' ||
    value === 'good' ||
    value === 'easy'
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isTimestamp(value: unknown): value is string {
  return typeof value === 'string' && Number.isFinite(Date.parse(value));
}
