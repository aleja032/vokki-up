export type DueWordTone = 'coral' | 'amber' | 'mint' | 'brand';

/** One word of today's hand, already reduced to what the home needs. */
export type DueWord = {
  id: string;
  term: string;
  phonetics: string;
  partOfSpeech: string;
  /** Memory strength, 0 (just seen or never reviewed) to 5 (solid). */
  memoryLevel: number;
  /** True when the card has never been reviewed. */
  isNew: boolean;
  /** Urgency colour: low memory is coral, new words are brand. */
  tone: DueWordTone;
};

export type WorldId = 'daily' | 'work' | 'travel' | 'phrases';

/** A word-library category as the home shows it: owned words out of the catalog. */
export type WorldProgress = {
  id: WorldId;
  name: string;
  learned: number;
  total: number;
};
