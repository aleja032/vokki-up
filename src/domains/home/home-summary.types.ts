import type { WeeklyActivity } from './types';

export type HomeSummary = {
  totalDue: number;
  newCount: number;
  pendingCount: number;
  completed: number;
  streakDays: number;
  wordsSeen: number;
  masteredWords: number;
  weeklyMinutes: number;
  weeklyActivity: WeeklyActivity[];
};
