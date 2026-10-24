import { z } from 'zod';
import { CARD_PARTS_OF_SPEECH } from '../cards/card-create.schema';
import { AI_PROVIDER_CATALOG, type AiSelection } from '../../lib/ai/catalog';
import {
  AiBoundaryError,
  type CardCaptureInput,
  type CardCaptureResult
} from './types';
import { validateAiSelection } from './validation';

const MAX_CANDIDATES = 20;

const candidateSchema = z
  .object({
    word: z.string().trim().min(1).max(120),
    original: z.string().trim().max(120).optional(),
    meaning: z.string().trim().min(1).max(500),
    phonetics: z.string().trim().max(120).default(''),
    example: z.string().trim().max(500).default(''),
    partOfSpeech: z
      .string()
      .refine(
        value => CARD_PARTS_OF_SPEECH.some(category => category === value),
        'Unsupported part of speech.'
      ),
    relatedWords: z
      .array(z.string().trim().min(1).max(120))
      .length(2, 'Exactly two related English words are required.')
  })
  .strict();

const responseSchema = z
  .object({
    candidates: z.array(candidateSchema).max(MAX_CANDIDATES)
  })
  .strict();

const GEMINI_RESPONSE_SCHEMA = {
  type: 'OBJECT',
  properties: {
    candidates: {
      type: 'ARRAY',
      items: {
        type: 'OBJECT',
        properties: {
          word: { type: 'STRING' },
          original: { type: 'STRING' },
          meaning: { type: 'STRING' },
          phonetics: { type: 'STRING' },
          example: { type: 'STRING' },
          partOfSpeech: {
            type: 'STRING',
            enum: [...CARD_PARTS_OF_SPEECH]
          },
          relatedWords: {
            type: 'ARRAY',
            items: { type: 'STRING' }
          }
        },
        required: [
          'word',
          'meaning',
          'phonetics',
          'example',
          'partOfSpeech',
          'relatedWords'
        ]
      }
    }
  },
  required: ['candidates']
} as const;

type GeminiCardCaptureProviderOptions = {
  apiKey: string;
  model: string;
  fetchImplementation?: typeof fetch;
};

export async function testGeminiConnection({
  apiKey,
  model,
  fetchImplementation = fetch
}: GeminiCardCaptureProviderOptions): Promise<void> {
  let response: Response;
  try {
    response = await fetchImplementation(
      `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: 'Reply with OK.' }] }],
          generationConfig: { maxOutputTokens: 1 }
        }),
        cache: 'no-store',
        signal: AbortSignal.timeout(10_000)
      }
    );
  } catch (error) {
    if (error instanceof DOMException && error.name === 'TimeoutError') {
      throw new AiBoundaryError(
        'CAPABILITY_UNAVAILABLE',
        'Gemini did not respond in time. Check your connection and try again.',
        504
      );
    }
    throw new AiBoundaryError(
      'CAPABILITY_UNAVAILABLE',
      'Gemini could not be reached. Check your connection and try again.',
      502
    );
  }

  if (!response.ok) {
    const message =
      response.status === 401 || response.status === 403
        ? 'Gemini rejected the API key. Check that it is valid and enabled for the selected model.'
        : response.status === 429
          ? 'Gemini rate limit or quota reached. Check the project quota and try again later.'
          : `Gemini could not verify this connection (HTTP ${response.status}). Check the selected model and try again.`;
    throw new AiBoundaryError(
      'CAPABILITY_UNAVAILABLE',
      message,
      response.status === 429 ? 429 : 502
    );
  }
}

export function createGeminiCardCaptureProvider({
  apiKey,
  model,
  fetchImplementation = fetch
}: GeminiCardCaptureProviderOptions) {
  return {
    async captureCards(input: CardCaptureInput): Promise<CardCaptureResult> {
      const parts = [
        { text: buildCapturePrompt(input) },
        ...(input.kind === 'image'
          ? [
              {
                inlineData: {
                  mimeType: input.mimeType,
                  data: input.base64
                }
              }
            ]
          : [])
      ];
      let response: Response;
      try {
        response = await fetchImplementation(
          `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-goog-api-key': apiKey
            },
            body: JSON.stringify({
              contents: [{ parts }],
              generationConfig: {
                responseMimeType: 'application/json',
                responseSchema: GEMINI_RESPONSE_SCHEMA,
                temperature: 0.2
              }
            }),
            cache: 'no-store',
            signal: AbortSignal.timeout(45_000)
          }
        );
      } catch (error) {
        if (error instanceof DOMException && error.name === 'TimeoutError') {
          throw new AiBoundaryError(
            'CAPABILITY_UNAVAILABLE',
            'The AI provider timed out. Check your connection and try again.',
            504
          );
        }
        throw new AiBoundaryError(
          'CAPABILITY_UNAVAILABLE',
          'The AI provider could not be reached. Check your connection and try again.',
          502
        );
      }

      if (!response.ok) {
        const message =
          response.status === 401 || response.status === 403
            ? 'Gemini rejected the server API key. Check GEMINI_API_KEY.'
            : response.status === 429
              ? 'Gemini rate limit or quota reached. Check the project quota and try again later.'
              : `Gemini could not process the capture (HTTP ${response.status}). Try again or create the card manually.`;
        throw new AiBoundaryError(
          'CAPABILITY_UNAVAILABLE',
          message,
          response.status === 429 ? 429 : 502
        );
      }

      let payload: unknown;
      try {
        payload = await response.json();
      } catch {
        throw invalidProviderResponse();
      }
      return normalizeGeminiCaptureResponse(payload);
    }
  };
}

export function normalizeGeminiCaptureResponse(
  value: unknown
): CardCaptureResult {
  if (!isRecord(value) || !Array.isArray(value.candidates)) {
    throw invalidProviderResponse();
  }
  const text = value.candidates
    .flatMap(candidate => {
      if (!isRecord(candidate) || !isRecord(candidate.content)) return [];
      const parts = candidate.content.parts;
      if (!Array.isArray(parts)) return [];
      return parts.flatMap(part =>
        isRecord(part) && typeof part.text === 'string' ? [part.text] : []
      );
    })
    .find(part => part.trim().length > 0);
  if (!text) throw invalidProviderResponse();

  let decoded: unknown;
  try {
    decoded = JSON.parse(text);
  } catch {
    throw invalidProviderResponse();
  }
  const parsed = responseSchema.safeParse(decoded);
  if (!parsed.success) throw invalidProviderResponse();

  return {
    candidates: parsed.data.candidates,
    notice: 'Review every field before creating cards.'
  };
}

export function resolveGeminiSelection(requested: AiSelection): AiSelection {
  const configuredProvider =
    process.env.AI_PROVIDER?.trim().toLocaleLowerCase() || requested.provider;
  if (configuredProvider !== 'gemini') {
    throw new AiBoundaryError(
      'CAPABILITY_UNAVAILABLE',
      `The configured provider "${configuredProvider}" is not connected for card capture. Choose Gemini or configure AI_PROVIDER=gemini.`,
      503
    );
  }

  const model =
    process.env.GEMINI_MODEL?.trim() ||
    process.env.AI_MODEL?.trim() ||
    requested.model;
  try {
    return validateAiSelection({ provider: 'gemini', model });
  } catch {
    const supportedModels = AI_PROVIDER_CATALOG.find(
      provider => provider.id === 'gemini'
    )?.models.join(', ');
    throw new AiBoundaryError(
      'CAPABILITY_UNAVAILABLE',
      `The configured Gemini model is not supported. Choose one of: ${supportedModels}.`,
      503
    );
  }
}

function buildCapturePrompt(input: CardCaptureInput): string {
  const guidance =
    'Extract up to 20 useful English words or phrases for a Spanish-speaking learner. Return only JSON matching the supplied schema. For every candidate provide a concise Spanish meaning, IPA pronunciation, one natural English example, one supported Spanish part of speech, and exactly two useful related English words without translations. Correct spelling when appropriate and put the source spelling in original; omit original when no correction is needed. Do not invent unreadable words. If no clear vocabulary can be identified, return an empty candidates array.';
  if (input.kind === 'text') {
    return `${guidance}\n\nUser vocabulary input:\n${input.text}`;
  }
  return `${guidance}\n\nIdentify visible vocabulary in this image and prepare candidates.`;
}

function invalidProviderResponse(): AiBoundaryError {
  return new AiBoundaryError(
    'INTERNAL_ERROR',
    'The AI provider returned an invalid response. Try again or create the cards manually.',
    502
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
