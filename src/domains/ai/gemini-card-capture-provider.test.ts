import { describe, expect, it } from 'vitest';
import { normalizeGeminiCaptureResponse } from './gemini-card-capture-provider';

describe('normalizeGeminiCaptureResponse', () => {
  it('normalizes a structured Gemini response into vocabulary candidates', () => {
    const result = normalizeGeminiCaptureResponse({
      candidates: [
        {
          content: {
            parts: [
              {
                text: JSON.stringify({
                  candidates: [
                    {
                      word: 'reliable',
                      original: 'relaiable',
                      meaning: 'Confiable',
                      phonetics: '/rɪˈlaɪəbəl/',
                      example: 'She is reliable.',
                      partOfSpeech: 'Adjetivo',
                      relatedWords: ['dependable', 'trustworthy']
                    }
                  ]
                })
              }
            ]
          }
        }
      ]
    });

    expect(result.candidates[0]).toMatchObject({
      word: 'reliable',
      original: 'relaiable',
      partOfSpeech: 'Adjetivo',
      relatedWords: ['dependable', 'trustworthy']
    });
  });

  it('rejects malformed model output instead of manufacturing empty fields', () => {
    expect(() =>
      normalizeGeminiCaptureResponse({
        candidates: [{ content: { parts: [{ text: '{"candidates":[{}]}' }] } }]
      })
    ).toThrow();
  });
});
