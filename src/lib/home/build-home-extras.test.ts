import { describe, expect, it } from 'vitest';
import { buildDueHand, deriveWeeklyAccuracy } from './build-home-extras';

const card = (id: string) => ({
  id,
  term: id,
  phonetics: `/${id}/`,
  partOfSpeech: 'Verbo'
});

describe('buildDueHand', () => {
  it('orders scheduled words by weakest memory, then new words', () => {
    const hand = buildDueHand(
      [card('fresh'), card('strong'), card('weak')],
      { strong: { repetitions: 4 }, weak: { repetitions: 1 } },
      4
    );
    expect(hand.map(word => word.id)).toEqual(['weak', 'strong', 'fresh']);
  });

  it('derives memory level, newness and tone from the schedule', () => {
    const [weak, mid, strong, fresh] = buildDueHand(
      [card('a'), card('b'), card('c'), card('d')],
      {
        a: { repetitions: 0 },
        b: { repetitions: 3 },
        c: { repetitions: 9 }
      }
    );
    expect(weak).toMatchObject({ memoryLevel: 0, tone: 'coral', isNew: false });
    expect(mid).toMatchObject({ memoryLevel: 3, tone: 'amber' });
    expect(strong).toMatchObject({ memoryLevel: 5, tone: 'mint' });
    expect(fresh).toMatchObject({ isNew: true, tone: 'brand', memoryLevel: 0 });
  });

  it('caps the hand at the limit', () => {
    const cards = Array.from({ length: 9 }, (_, index) => card(`c${index}`));
    expect(buildDueHand(cards, {})).toHaveLength(4);
    expect(buildDueHand(cards, {}, 0)).toEqual([]);
  });
});

describe('deriveWeeklyAccuracy', () => {
  const now = new Date('2026-05-20T12:00:00.000Z');

  it('is null without reviews in the last week', () => {
    expect(deriveWeeklyAccuracy([], now)).toBeNull();
    expect(
      deriveWeeklyAccuracy(
        [{ rating: 'good', reviewedAt: '2026-05-01T12:00:00.000Z' }],
        now
      )
    ).toBeNull();
  });

  it('counts every rating except again as recalled', () => {
    const events = [
      { rating: 'good', reviewedAt: '2026-05-19T12:00:00.000Z' },
      { rating: 'hard', reviewedAt: '2026-05-18T12:00:00.000Z' },
      { rating: 'easy', reviewedAt: '2026-05-17T12:00:00.000Z' },
      { rating: 'again', reviewedAt: '2026-05-16T12:00:00.000Z' }
    ];
    expect(deriveWeeklyAccuracy(events, now)).toBe(75);
  });
});
