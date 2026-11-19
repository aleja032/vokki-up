import type { CardSchedule } from './scheduling/types';

// Memory strength shown on a card tile: the real repetition count of its
// schedule, capped at five segments. A card with no schedule is new.
export const MAX_CARD_MEMORY = 5;

export type CardMemoryTone = 'brand' | 'coral' | 'amber' | 'mint';

export type CardMemory = {
  level: number;
  tone: CardMemoryTone;
};

// Tone of a scheduled card at a given strength (weak to strong).
export function getCardMemoryFromLevel(repetitions: number): CardMemory {
  const level = Math.min(Math.max(repetitions, 0), MAX_CARD_MEMORY);
  if (level <= 1) return { level, tone: 'coral' };
  return { level, tone: level <= 3 ? 'amber' : 'mint' };
}

export function getCardMemory(schedule: CardSchedule | undefined): CardMemory {
  if (!schedule) return { level: 0, tone: 'brand' };
  return getCardMemoryFromLevel(schedule.repetitions);
}
