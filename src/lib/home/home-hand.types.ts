export type DueWordTone = 'coral' | 'amber' | 'mint' | 'brand';

/** One word of today's hand, already reduced to what the home needs. */
export type DueWord = {
  id: string;
  term: string;
  meaning: string;
  phonetics: string;
  partOfSpeech: string;
  /** Memory strength, 0 (just seen or never reviewed) to 5 (solid). */
  memoryLevel: number;
  /** True when the card has never been reviewed. */
  isNew: boolean;
  /** Urgency colour: low memory is coral, new words are brand. */
  tone: DueWordTone;
};

export type MissionStepState = 'done' | 'current' | 'upcoming';

/** One word of today's mission path: recalled, being worked on, or waiting. */
export type MissionStep = { term: string; state: MissionStepState };

/** Today's mission: up to five words, the ones already recalled first. */
export type HomeMission = {
  steps: MissionStep[];
  doneCount: number;
  /** The word to recall next, or null once the mission is complete. */
  nextTerm: string | null;
};

/** Cards by review urgency, the same three buckets as the Mi mazo filter. */
export type UpcomingReviews = { today: number; week: number; safe: number };

export type WorldId = 'daily' | 'work' | 'travel' | 'phrases';

/** A word-library category as the home shows it: owned words out of the catalog. */
export type WorldProgress = {
  id: WorldId;
  name: string;
  learned: number;
  total: number;
};
