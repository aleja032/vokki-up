import { describe, expect, it } from 'vitest';
import { deriveStreakDays, isStreakEventList } from './derive-streak';

const event = (localDate: string, earnsDailyCredit = true) => ({
  localDate,
  earnsDailyCredit
});

describe('deriveStreakDays', () => {
  const today = new Date(2026, 4, 20, 12);

  it('counts consecutive credited days ending today', () => {
    expect(
      deriveStreakDays(
        [event('2026-05-20'), event('2026-05-19'), event('2026-05-17')],
        today
      )
    ).toBe(2);
  });

  it('keeps the streak alive when today has no review yet', () => {
    expect(deriveStreakDays([event('2026-05-19')], today)).toBe(1);
  });

  it('ignores uncredited reviews and breaks on gaps', () => {
    expect(deriveStreakDays([event('2026-05-20', false)], today)).toBe(0);
    expect(deriveStreakDays([event('2026-05-18')], today)).toBe(0);
  });
});

describe('isStreakEventList', () => {
  it('accepts review events and rejects other shapes', () => {
    expect(isStreakEventList([event('2026-05-20')])).toBe(true);
    expect(isStreakEventList([{ localDate: 1 }])).toBe(false);
    expect(isStreakEventList('nope')).toBe(false);
  });
});
