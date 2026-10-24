import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  normalizeGeminiCaptureResponse,
  testGeminiConnection
} from './gemini-card-capture-provider';

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

describe('testGeminiConnection', () => {
  afterEach(() => vi.restoreAllMocks());

  it('sends a minimal generateContent request for the selected model', async () => {
    const fetchImplementation = vi
      .fn<typeof fetch>()
      .mockResolvedValue(new Response('{}', { status: 200 }));

    await testGeminiConnection({
      apiKey: 'test-api-key-with-at-least-twenty-chars',
      model: 'gemini-2.5-flash',
      fetchImplementation
    });

    expect(fetchImplementation).toHaveBeenCalledOnce();
    expect(fetchImplementation).toHaveBeenCalledWith(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent',
      expect.objectContaining({
        method: 'POST',
        cache: 'no-store',
        headers: expect.objectContaining({
          'x-goog-api-key': 'test-api-key-with-at-least-twenty-chars'
        }),
        body: expect.stringContaining('maxOutputTokens')
      })
    );
  });

  it('returns an actionable error for a rejected key without echoing it', async () => {
    const apiKey = 'test-api-key-with-at-least-twenty-chars';
    const fetchImplementation = vi
      .fn<typeof fetch>()
      .mockResolvedValue(new Response('', { status: 403 }));

    await expect(
      testGeminiConnection({
        apiKey,
        model: 'gemini-2.5-flash',
        fetchImplementation
      })
    ).rejects.toThrow(/Gemini rejected the API key/i);
    await expect(
      testGeminiConnection({
        apiKey,
        model: 'gemini-2.5-flash',
        fetchImplementation
      })
    ).rejects.not.toThrow(apiKey);
  });
});
