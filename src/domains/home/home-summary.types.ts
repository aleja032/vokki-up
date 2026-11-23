import type {
  DueWord,
  HomeMission,
  UpcomingReviews,
  WorldProgress
} from '@/lib/home/home-hand.types';
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
  /** Up to four due words, composed by the container from the cards domain. */
  dueHand: DueWord[];
  /** Today's mission path, or null when there is nothing to recall. */
  mission: HomeMission | null;
  /** Cards by review urgency (today, within a week, later). */
  upcoming: UpcomingReviews;
  /** Whole percentage of reviews not rated "again" this week, or null. */
  weeklyAccuracy: number | null;
  /** Default word-library categories with owned words out of the catalog. */
  worlds: WorldProgress[];
};
