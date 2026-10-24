import { describe, expect, it } from 'vitest';
import { deduplicateCaptureCandidates } from './capture-candidates';
import type { CardCandidate } from './types';

function candidate(
  word: string,
  overrides: Partial<CardCandidate> = {}
): CardCandidate {
  return {
    word,
    meaning: 'Meaning',
    phonetics: '/word/',
    example: 'An example sentence.',
    partOfSpeech: 'verb',
    relatedWords: [],
    ...overrides
  };
}

describe('deduplicateCaptureCandidates', () => {
  it('uses the typed candidate as primary and fills its missing fields from the image', () => {
    const typed = candidate('  Take   off ', {
      meaning: 'Despegar',
      phonetics: ' ',
      example: 'The plane took off.',
      relatedWords: ['depart']
    });
    const image = candidate('TAKE off', {
      original: 'take of',
      meaning: 'To become airborne',
      phonetics: '/teɪk ɔːf/',
      example: 'The bird took off.',
      partOfSpeech: 'phrasal verb',
      relatedWords: ['depart', 'launch', 'fly']
    });

    expect(
      deduplicateCaptureCandidates([
        { source: 'typed', candidate: typed },
        { source: 'image', candidate: image }
      ])
    ).toEqual([
      {
        source: 'typed',
        candidate: {
          ...typed,
          original: 'take of',
          phonetics: '/teɪk ɔːf/',
          relatedWords: ['depart', 'launch']
        }
      }
    ]);
  });

  it('preserves unique order and source metadata while deduplicating normalized terms', () => {
    const imageFirst = candidate(' set   out ');
    const imageDuplicate = candidate('TURN IN', { meaning: 'Presentar' });
    const typedDuplicate = candidate(' Turn in ', { meaning: 'Entregar' });
    const imageLast = candidate('look up');

    expect(
      deduplicateCaptureCandidates([
        { source: 'image', candidate: imageFirst },
        { source: 'image', candidate: imageDuplicate },
        { source: 'typed', candidate: typedDuplicate },
        { source: 'image', candidate: imageLast }
      ])
    ).toEqual([
      { source: 'image', candidate: imageFirst },
      {
        source: 'typed',
        candidate: {
          ...typedDuplicate,
          phonetics: imageDuplicate.phonetics,
          example: imageDuplicate.example,
          partOfSpeech: imageDuplicate.partOfSpeech,
          relatedWords: imageDuplicate.relatedWords
        }
      },
      { source: 'image', candidate: imageLast }
    ]);
  });
});
