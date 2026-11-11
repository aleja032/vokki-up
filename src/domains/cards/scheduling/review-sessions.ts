import type { ReviewSession } from './types';

export type ReviewSessionInput = Pick<
  ReviewSession,
  'id' | 'startAt' | 'endAt'
>;

export function createCompletedReviewSession(
  input: ReviewSessionInput
): ReviewSession | null {
  const startedAt = Date.parse(input.startAt);
  const endedAt = Date.parse(input.endAt);
  if (
    !input.id ||
    !Number.isFinite(startedAt) ||
    !Number.isFinite(endedAt) ||
    endedAt < startedAt
  ) {
    return null;
  }

  const durationMs = endedAt - startedAt;
  return {
    ...input,
    durationMs,
    durationMinutes: durationMs / 60_000
  };
}

/** Sum complete session durations whose end falls in the current local week. */
export function getWeeklyStudyMinutes(
  sessions: ReviewSession[],
  now: Date
): number {
  const weekStart = new Date(now);
  const weekdayFromMonday = (weekStart.getDay() + 6) % 7;
  weekStart.setDate(weekStart.getDate() - weekdayFromMonday);
  weekStart.setHours(0, 0, 0, 0);

  const startTime = weekStart.getTime();
  const nowTime = now.getTime();
  const totalMilliseconds = sessions.reduce((total, session) => {
    const startedAt = Date.parse(session.startAt);
    const endedAt = Date.parse(session.endAt);
    if (
      !Number.isFinite(startedAt) ||
      !Number.isFinite(endedAt) ||
      endedAt < startedAt ||
      endedAt < startTime ||
      endedAt > nowTime
    ) {
      return total;
    }
    return total + (endedAt - startedAt);
  }, 0);

  return Math.floor(totalMilliseconds / 60_000);
}
