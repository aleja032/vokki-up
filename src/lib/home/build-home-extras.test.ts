import { describe, expect, it } from 'vitest';
import {
  buildDueHand,
  buildMission,
  deriveWeeklyAccuracy
} from './build-home-extras';

const card = (id: string) => ({
  id,
  term: id,
  meaning: `${id} meaning`,
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
    const [weak, mid, firm, strong, fresh] = buildDueHand(
      [card('a'), card('b'), card('e'), card('c'), card('d')],
      {
        a: { repetitions: 0 },
        b: { repetitions: 2 },
        e: { repetitions: 3 },
        c: { repetitions: 9 }
      }
    );
    expect(weak).toMatchObject({ memoryLevel: 0, tone: 'coral', isNew: false });
    expect(mid).toMatchObject({ memoryLevel: 2, tone: 'amber' });
    expect(firm).toMatchObject({ memoryLevel: 3, tone: 'brand' });
    expect(strong).toMatchObject({ memoryLevel: 5, tone: 'mint' });
    expect(fresh).toMatchObject({ isNew: true, tone: 'brand', memoryLevel: 0 });
  });

  it('spreads a full hand across memory levels like the design', () => {
    const cards = ['w1', 'w2', 'w3', 'm1', 'm2', 's1', 'n1', 'n2'].map(card);
    const hand = buildDueHand(
      cards,
      {
        w1: { repetitions: 0 },
        w2: { repetitions: 1 },
        w3: { repetitions: 1 },
        m1: { repetitions: 2 },
        m2: { repetitions: 2 },
        s1: { repetitions: 5 }
      },
      4
    );
    expect(new Set(hand.map(word => word.tone)).size).toBe(4);
    // Still weakest first so the mission and the "most urgent" hint hold.
    expect(hand[0].tone).toBe('coral');
    expect(hand[hand.length - 1].isNew).toBe(true);
  });

  it('caps the hand at the limit', () => {
    const cards = Array.from({ length: 9 }, (_, index) => card(`c${index}`));
    expect(buildDueHand(cards, {})).toHaveLength(6);
    expect(buildDueHand(cards, {}, 0)).toEqual([]);
  });
});

describe('buildMission', () => {
  const terms = { a: 'alpha', b: 'beta' };
  const hand = [{ term: 'alpha' }, { term: 'gamma' }, { term: 'delta' }];

  it('puts recalled words first and marks the next one', () => {
    const mission = buildMission(
      [
        { cardId: 'a', rating: 'good', localDate: '2026-05-20' },
        { cardId: 'b', rating: 'again', localDate: '2026-05-20' },
        { cardId: 'b', rating: 'good', localDate: '2026-05-19' }
      ],
      terms,
      hand,
      '2026-05-20'
    );
    expect(mission).toEqual({
      steps: [
        { term: 'alpha', state: 'done' },
        { term: 'gamma', state: 'current' },
        { term: 'delta', state: 'upcoming' }
      ],
      doneCount: 1,
      nextTerm: 'gamma'
    });
  });

  it('is null with nothing recalled and an empty hand', () => {
    expect(buildMission([], terms, [], '2026-05-20')).toBeNull();
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
