import { describe, expect, it } from 'vitest';
import { removePersonalCards } from './personal-card-removal';
import type { ReviewEvent, CardScheduleMap } from './scheduling/types';
import type { VocabularyCard } from './types';

const card = (id: string): VocabularyCard => ({
  id,
  term: id,
  meaning: `meaning ${id}`,
  phonetics: '',
  example: '',
  partOfSpeech: 'Sustantivo',
  groupId: 'group-1',
  tags: [],
  relatedWords: []
});

const schedule = (cardId: string) => ({
  cardId,
  repetitions: 1,
  intervalMinutes: 60,
  dueAt: '2026-11-13T12:00:00.000Z',
  lastReviewedAt: '2026-11-12T12:00:00.000Z',
  lastRating: 'good' as const
});

const event = (id: string, cardId: string): ReviewEvent => ({
  id,
  cardId,
  rating: 'good',
  reviewedAt: '2026-11-12T12:00:00.000Z',
  localDate: '2026-11-12',
  earnsDailyCredit: true
});

describe('removePersonalCards', () => {
  it('removes selected cards and only their schedule and review events', () => {
    const data = {
      cards: [card('target'), card('keep')],
      schedules: { target: schedule('target'), keep: schedule('keep') },
      reviewEvents: [
        event('target-review', 'target'),
        event('keep-review', 'keep')
      ]
    } satisfies {
      cards: VocabularyCard[];
      schedules: CardScheduleMap;
      reviewEvents: ReviewEvent[];
    };

    const next = removePersonalCards(data, ['target']);

    expect(next).toEqual({
      cards: [card('keep')],
      schedules: { keep: schedule('keep') },
      reviewEvents: [event('keep-review', 'keep')]
    });
  });

  it('leaves unrelated state unchanged when the card does not exist', () => {
    const data = {
      cards: [card('keep')],
      schedules: { keep: schedule('keep') },
      reviewEvents: [event('keep-review', 'keep')]
    };

    expect(removePersonalCards(data, ['missing'])).toBe(data);
  });

  it('does not mutate the source collections', () => {
    const data = {
      cards: [card('target'), card('keep')],
      schedules: { target: schedule('target'), keep: schedule('keep') },
      reviewEvents: [
        event('target-review', 'target'),
        event('keep-review', 'keep')
      ]
    };
    const originalCards = [...data.cards];
    const originalSchedules = { ...data.schedules };
    const originalEvents = [...data.reviewEvents];

    removePersonalCards(data, ['target']);

    expect(data.cards).toEqual(originalCards);
    expect(data.schedules).toEqual(originalSchedules);
    expect(data.reviewEvents).toEqual(originalEvents);
  });

  it('removes a batch while preserving every unselected card and progress record', () => {
    const data = {
      cards: [card('first'), card('keep'), card('second')],
      schedules: {
        first: schedule('first'),
        keep: schedule('keep'),
        second: schedule('second')
      },
      reviewEvents: [
        event('first-review', 'first'),
        event('keep-review', 'keep'),
        event('second-review', 'second')
      ]
    };

    expect(removePersonalCards(data, ['first', 'second'])).toEqual({
      cards: [card('keep')],
      schedules: { keep: schedule('keep') },
      reviewEvents: [event('keep-review', 'keep')]
    });
  });
});
