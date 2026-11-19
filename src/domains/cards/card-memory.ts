import type { CardSchedule } from './scheduling/types';

// Memory strength shown on a card tile: the real repetition count of its
// schedule, capped at five segments. A card with no schedule is new.
export const MAX_CARD_MEMORY = 5;

export type CardMemoryTone = 'brand' | 'coral' | 'amber' | 'mint';

export type CardMemory = {
  level: number;
  tone: CardMemoryTone;
};

export function getCardMemory(schedule: CardSchedule | undefined): CardMemory {
  if (!schedule) return { level: 0, tone: 'brand' };
  const level = Math.min(Math.max(schedule.repetitions, 0), MAX_CARD_MEMORY);
  if (level <= 1) return { level, tone: 'coral' };
  return { level, tone: level <= 3 ? 'amber' : 'mint' };
}
