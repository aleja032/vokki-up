import { describe, expect, it } from 'vitest';
import { mapCapturedCandidatesToCards } from '../captured-cards';

describe('mapCapturedCandidatesToCards', () => {
  it('maps reviewed candidates into local vocabulary cards without dropping enrichment', () => {
    const cards = mapCapturedCandidatesToCards(
      [
        {
          word: 'reliable',
          meaning: 'Confiable',
          phonetics: '/rɪˈlaɪəbəl/',
          example: 'She is reliable.',
          partOfSpeech: 'Adjetivo',
          relatedWords: ['dependable', 'trustworthy']
        }
      ],
      'user-group',
      () => 'card-id'
    );

    expect(cards).toEqual([
      {
        id: 'card-id',
        term: 'reliable',
        meaning: 'Confiable',
        phonetics: '/rɪˈlaɪəbəl/',
        example: 'She is reliable.',
        partOfSpeech: 'Adjetivo',
        groupId: 'user-group',
        tags: [],
        relatedWords: ['dependable', 'trustworthy']
      }
    ]);
  });
});
