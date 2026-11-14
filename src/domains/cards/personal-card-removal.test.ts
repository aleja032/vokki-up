import { describe, expect, it } from 'vitest';
import type { CardScheduleMap, ReviewEvent } from './scheduling/types';
import type { VocabularyCard } from './types';
import {
  getPersonalCardsForCatalogTerm,
  removeCardSchedulesById,
  removePersonalCardsById,
  removeReviewEventsByCardId
} from './personal-card-removal';

const cards: VocabularyCard[] = [
  {
    id: 'owned-1',
    term: '  Hello  ',
    meaning: 'Hola',
    phonetics: '/həˈloʊ/',
    example: 'Hello there.',
    partOfSpeech: 'phrase',
    groupId: 'phrases',
    tags: []
  },
  {
    id: 'owned-2',
    term: 'hello',
    meaning: 'Hola',
    phonetics: '/həˈloʊ/',
    example: 'Hello again.',
    partOfSpeech: 'phrase',
    groupId: 'phrases',
    tags: []
  },
  {
    id: 'unrelated',
    term: 'Goodbye',
    meaning: 'Adiós',
    phonetics: '/ɡʊdˈbaɪ/',
    example: 'Goodbye for now.',
    partOfSpeech: 'phrase',
    groupId: 'phrases',
    tags: []
  }
];

describe('personal Word Library card removal', () => {
  it('finds only personal cards whose normalized term matches the catalog term', () => {
    expect(
      getPersonalCardsForCatalogTerm(cards, 'Hello').map(card => card.id)
    ).toEqual(['owned-1', 'owned-2']);
  });

  it('removes selected personal card IDs without mutating the input list', () => {
    expect(removePersonalCardsById(cards, ['owned-1', 'owned-2'])).toEqual([
      cards[2]
    ]);
    expect(cards).toHaveLength(3);
    expect(removePersonalCardsById(cards, [])).toEqual(cards);
  });

  it('removes review schedules for deleted card IDs and preserves other progress', () => {
    const schedules = {
      'owned-1': {
        cardId: 'owned-1',
        repetitions: 1,
        intervalMinutes: 10,
        dueAt: '2026-11-13T00:00:00.000Z',
        lastReviewedAt: '2026-11-12T00:00:00.000Z',
        lastRating: 'good'
      },
      'owned-2': {
        cardId: 'owned-2',
        repetitions: 2,
        intervalMinutes: 20,
        dueAt: '2026-11-13T00:00:00.000Z',
        lastReviewedAt: '2026-11-12T00:00:00.000Z',
        lastRating: 'easy'
      },
      unrelated: {
        cardId: 'unrelated',
        repetitions: 3,
        intervalMinutes: 30,
        dueAt: '2026-11-13T00:00:00.000Z',
        lastReviewedAt: '2026-11-12T00:00:00.000Z',
        lastRating: 'again'
      }
    } satisfies CardScheduleMap;

    expect(removeCardSchedulesById(schedules, ['owned-1', 'owned-2'])).toEqual({
      unrelated: schedules.unrelated
    });
    expect(Object.keys(schedules)).toHaveLength(3);
  });

  it('removes review events for deleted cards without changing other history', () => {
    const events = [
      {
        id: 'event-1',
        cardId: 'owned-1',
        rating: 'good',
        reviewedAt: '2026-11-12T00:00:00.000Z',
        localDate: '2026-11-12',
        earnsDailyCredit: true
      },
      {
        id: 'event-2',
        cardId: 'owned-2',
        rating: 'easy',
        reviewedAt: '2026-11-12T00:00:00.000Z',
        localDate: '2026-11-12',
        earnsDailyCredit: false
      },
      {
        id: 'event-3',
        cardId: 'unrelated',
        rating: 'again',
        reviewedAt: '2026-11-12T00:00:00.000Z',
        localDate: '2026-11-12',
        earnsDailyCredit: true
      }
    ] satisfies ReviewEvent[];

    expect(removeReviewEventsByCardId(events, ['owned-1', 'owned-2'])).toEqual([
      events[2]
    ]);
    expect(events).toHaveLength(3);
  });
});
