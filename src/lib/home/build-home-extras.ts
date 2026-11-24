import type {
  DueWord,
  DueWordTone,
  HomeMission,
  MissionStep
} from './home-hand.types';

// Structural inputs: src/lib never imports a domain, so these mirror only the
// fields read from the cards domain.
type HandCard = {
  id: string;
  term: string;
  meaning: string;
  phonetics: string;
  partOfSpeech: string;
};

type HandSchedule = { repetitions: number };

type AccuracyEvent = { rating: string; reviewedAt: string };

export const MAX_MEMORY_LEVEL = 5;
export const DEFAULT_HAND_SIZE = 6;
export const MISSION_SIZE = 5;

const DAY_MS = 24 * 60 * 60 * 1000;

// Fragile (coral), learning (amber), firm (violet), mastered (mint).
function toneFor(memoryLevel: number, isNew: boolean): DueWordTone {
  if (isNew) return 'brand';
  if (memoryLevel <= 1) return 'coral';
  if (memoryLevel === 2) return 'amber';
  return memoryLevel === 3 ? 'brand' : 'mint';
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
  const ranked = dueCards
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
        meaning: card.meaning,
        phonetics: card.phonetics,
        partOfSpeech: card.partOfSpeech,
        memoryLevel,
        isNew,
        tone: toneFor(memoryLevel, isNew)
      };
      return { word, index };
    })
    .sort(byUrgency);

  // Take words round-robin from every memory bucket so the hand shows the
  // whole range (fragile to mastered, plus new) instead of one level only,
  // then put the picks back in urgency order.
  const buckets = new Map<string, Ranked[]>();
  for (const entry of ranked) {
    const key = entry.word.isNew ? 'new' : entry.word.tone;
    buckets.set(key, [...(buckets.get(key) ?? []), entry]);
  }
  const queues = [...buckets.values()];
  const picked: Ranked[] = [];
  const size = Math.max(0, limit);
  for (
    let round = 0;
    picked.length < size && queues.some(q => q[round]);
    round++
  ) {
    for (const queue of queues) {
      if (queue[round] && picked.length < size) picked.push(queue[round]);
    }
  }
  return picked.sort(byUrgency).map(entry => entry.word);
}

type Ranked = { word: DueWord; index: number };

function byUrgency(left: Ranked, right: Ranked): number {
  return (
    Number(left.word.isNew) - Number(right.word.isNew) ||
    left.word.memoryLevel - right.word.memoryLevel ||
    left.index - right.index
  );
}

type MissionEvent = { cardId: string; rating: string; localDate: string };

/**
 * Today's mission path (up to five words): the words already recalled today
 * (reviewed and not rated "again") come first, then the weakest words of the
 * due hand. Null when there is nothing to show.
 */
export function buildMission(
  events: MissionEvent[],
  termByCardId: Record<string, string | undefined>,
  hand: { term: string }[],
  todayKey: string
): HomeMission | null {
  const recalled: string[] = [];
  for (const event of events) {
    if (event.localDate !== todayKey || event.rating === 'again') continue;
    const term = termByCardId[event.cardId];
    if (term && !recalled.includes(term)) recalled.push(term);
  }
  const done = recalled.slice(-MISSION_SIZE);
  const pending = hand
    .map(word => word.term)
    .filter(term => !done.includes(term))
    .slice(0, MISSION_SIZE - done.length);
  if (done.length + pending.length === 0) return null;

  const steps: MissionStep[] = [
    ...done.map(term => ({ term, state: 'done' as const })),
    ...pending.map((term, index) => ({
      term,
      state: index === 0 ? ('current' as const) : ('upcoming' as const)
    }))
  ];
  return { steps, doneCount: done.length, nextTerm: pending[0] ?? null };
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
