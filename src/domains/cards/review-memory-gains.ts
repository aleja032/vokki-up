// Cards whose memory strength went up during one review round. Levels are the
// real repetition counts of the schedule before and after each rating.
export type MemoryGain = {
  cardId: string;
  term: string;
  from: number;
  to: number;
};

export const MAX_VISIBLE_MEMORY_GAINS = 3;

// Keeps one entry per card: the level it had when the round first touched it
// and the level it has now (a card repeated after "again" updates `to`).
export function recordMemoryGain(
  gains: MemoryGain[],
  change: MemoryGain
): MemoryGain[] {
  const existing = gains.find(gain => gain.cardId === change.cardId);
  if (!existing) return [...gains, change];
  return gains.map(gain =>
    gain.cardId === change.cardId ? { ...gain, to: change.to } : gain
  );
}

// Only cards that really ended the round stronger than they started.
export function selectMemoryGains(
  gains: MemoryGain[],
  limit: number = MAX_VISIBLE_MEMORY_GAINS
): MemoryGain[] {
  return gains.filter(gain => gain.to > gain.from).slice(0, limit);
}
