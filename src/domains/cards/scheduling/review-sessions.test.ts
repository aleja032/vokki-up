import { describe, expect, it } from 'vitest';
import {
  createCompletedReviewSession,
  getWeeklyStudyMinutes
} from './review-sessions';

const session = (id: string, startAt: string, endAt: string) =>
  createCompletedReviewSession({ id, startAt, endAt });

describe('review session duration', () => {
  it('records real start/end times and fractional elapsed minutes', () => {
    expect(
      session('s1', '2026-10-20T10:00:00.000Z', '2026-10-20T10:02:30.000Z')
    ).toEqual({
      id: 's1',
      startAt: '2026-10-20T10:00:00.000Z',
      endAt: '2026-10-20T10:02:30.000Z',
      durationMs: 150_000,
      durationMinutes: 2.5
    });
  });

  it('rejects invalid or reversed session timestamps', () => {
    expect(session('bad', 'invalid', '2026-10-20T10:02:30.000Z')).toBeNull();
    expect(
      session('bad', '2026-10-20T10:02:30.000Z', '2026-10-20T10:00:00.000Z')
    ).toBeNull();
  });

  it('sums only completed sessions ending in the current local week', () => {
    const now = new Date(2026, 9, 23, 12, 0, 0);
    const thisWeek = new Date(2026, 9, 20, 10, 0, 0);
    const previousWeek = new Date(2026, 9, 12, 10, 0, 0);
    const sessions = [
      session(
        'this-week',
        thisWeek.toISOString(),
        new Date(thisWeek.getTime() + 89_000).toISOString()
      ),
      session(
        'same-week',
        thisWeek.toISOString(),
        new Date(thisWeek.getTime() + 91_000).toISOString()
      ),
      session(
        'previous-week',
        previousWeek.toISOString(),
        new Date(previousWeek.getTime() + 300_000).toISOString()
      ),
      {
        id: 'unfinished',
        startAt: now.toISOString(),
        endAt: '',
        durationMs: 0,
        durationMinutes: 0
      }
    ].filter(value => value !== null);

    expect(getWeeklyStudyMinutes(sessions, now)).toBe(3);
    expect(getWeeklyStudyMinutes([], now)).toBe(0);
  });
});
