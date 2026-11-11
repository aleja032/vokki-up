import type { CardRating, VocabularyCard } from '../types';

export type CardSchedule = {
  cardId: string;
  repetitions: number;
  intervalMinutes: number;
  dueAt: string;
  lastReviewedAt: string;
  lastRating: CardRating;
};

export type ReviewEvent = {
  id: string;
  cardId: string;
  rating: CardRating;
  reviewedAt: string;
  localDate: string;
  earnsDailyCredit: boolean;
};

export type ReviewSession = {
  id: string;
  startAt: string;
  endAt: string;
  durationMs: number;
  durationMinutes: number;
};

export type ReviewEventInput = Omit<ReviewEvent, 'earnsDailyCredit'>;

export type ScheduleReviewInput = {
  cardId: string;
  current: CardSchedule | undefined;
  rating: CardRating;
  reviewedAt: Date;
};

export interface ReviewScheduler {
  schedule(input: ScheduleReviewInput): CardSchedule;
}

export type ReviewableCard = Pick<VocabularyCard, 'id'>;
export type CardScheduleMap = Record<string, CardSchedule>;
