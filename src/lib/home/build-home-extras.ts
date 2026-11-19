import type { DueWord, DueWordTone } from './home-hand.types';

// Structural inputs: src/lib never imports a domain, so these mirror only the
// fields read from the cards domain.
type HandCard = {
  id: string;
  term: string;
  phonetics: string;
  partOfSpeech: string;
};

type HandSchedule = { repetitions: number };

type AccuracyEvent = { rating: string; reviewedAt: string };

export const MAX_MEMORY_LEVEL = 5;
export const DEFAULT_HAND_SIZE = 4;

const DAY_MS = 24 * 60 * 60 * 1000;

function toneFor(memoryLevel: number, isNew: boolean): DueWordTone {
  if (isNew) return 'brand';
  if (memoryLevel <= 1) return 'coral';
  return memoryLevel <= 3 ? 'amber' : 'mint';
}

/**
 * Turns the cards that are due now into the hand shown on the home.
 * Scheduled words come first, weakest memory first; new words follow.
 * Memory level is the real repetition count of the schedule, capped at 5.
 */
export function buildDueHand(
  dueCards: HandCard[],
  schedules: Record<string, HandSchedule | undefined>,
  limit: number = DEFAULT_HAND_SIZE
): DueWord[] {
  return dueCards
    .map((card, index) => {
      const schedule = schedules[card.id];
      const isNew = !schedule;
      const memoryLevel = Math.min(
        schedule?.repetitions ?? 0,
        MAX_MEMORY_LEVEL
      );
      const word: DueWord = {
        id: card.id,
        term: card.term,
        phonetics: card.phonetics,
        partOfSpeech: card.partOfSpeech,
        memoryLevel,
        isNew,
        tone: toneFor(memoryLevel, isNew)
      };
      return { word, index };
    })
    .sort(
      (left, right) =>
        Number(left.word.isNew) - Number(right.word.isNew) ||
        left.word.memoryLevel - right.word.memoryLevel ||
        left.index - right.index
    )
    .slice(0, Math.max(0, limit))
    .map(entry => entry.word);
}

/**
 * Share of reviews in the last 7 days that were not rated "again", as a whole
 * percentage. Null when there are no reviews to measure.
 */
export function deriveWeeklyAccuracy(
  events: AccuracyEvent[],
  now: Date
): number | null {
  const since = now.getTime() - 7 * DAY_MS;
  const recent = events.filter(event => {
    const reviewedAt = Date.parse(event.reviewedAt);
    return reviewedAt >= since && reviewedAt <= now.getTime();
  });
  if (recent.length === 0) return null;
  const recalled = recent.filter(event => event.rating !== 'again').length;
  return Math.round((recalled / recent.length) * 100);
}
