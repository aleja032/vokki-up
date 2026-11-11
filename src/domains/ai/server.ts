import { DEFAULT_AI_SELECTION, type AiSelection } from '../../lib/ai/catalog';
import {
  AiBoundaryError,
  type AiCapabilityProvider,
  type CardCaptureInput,
  type CardCaptureResult
} from './types';
import { mockAiProvider } from './mock-provider';
import { validateAiSelection } from './validation';
import {
  createGeminiCardCaptureProvider,
  normalizeGeminiCaptureResponse
} from './gemini-card-capture-provider';

export function resolveAiSelection(value: unknown): AiSelection {
  if (!value) return DEFAULT_AI_SELECTION;
  return validateAiSelection(value);
}

export function getAiCapabilityProvider(): AiCapabilityProvider {
  if (process.env.NODE_ENV !== 'development') {
    throw new AiBoundaryError(
      'CAPABILITY_UNAVAILABLE',
      'AI capabilities are not configured for this environment.',
      503
    );
  }
  return mockAiProvider;
}

export function resolveCardCaptureCredentials(input: {
  authenticated: boolean;
  requestedSelection: AiSelection;
  transientApiKey?: string;
  savedCredential: { selection: AiSelection; apiKey: string } | null;
}): { selection: AiSelection; apiKey: string } {
  if (input.authenticated) {
    if (!input.savedCredential) {
      throw new AiBoundaryError(
        'AUTH_REQUIRED',
        'Save a provider credential in settings before using Cards AI.',
        401
      );
    }
    return input.savedCredential;
  }
  if (!input.transientApiKey) {
    throw new AiBoundaryError(
      'AUTH_REQUIRED',
      'Enter a temporary API key in settings to use Cards AI while signed out.',
      400
    );
  }
  return { selection: input.requestedSelection, apiKey: input.transientApiKey };
}

export function getCardCaptureProvider(selection: AiSelection, apiKey: string) {
  const supported = validateAiSelection(selection);
  if (!apiKey)
    throw new AiBoundaryError(
      'CAPABILITY_UNAVAILABLE',
      'A provider API key is required.',
      401
    );
  if (supported.provider === 'gemini') {
    return createGeminiCardCaptureProvider({ apiKey, model: supported.model });
  }
  return createOpenAiCardCaptureProvider({ apiKey, model: supported.model });
}

function createOpenAiCardCaptureProvider(options: {
  apiKey: string;
  model: string;
}) {
  return {
    async captureCards(input: CardCaptureInput): Promise<CardCaptureResult> {
      const content = [
        { type: 'text', text: buildCapturePrompt(input) },
        ...(input.kind === 'image'
          ? [
              {
                type: 'image_url',
                ['image_url']: {
                  url: `data:${input.mimeType};base64,${input.base64}`
                }
              }
            ]
          : [])
      ];
      let response: Response;
      try {
        response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${options.apiKey}`
          },
          body: JSON.stringify({
            model: options.model,
            messages: [{ role: 'user', content }],
            ['response_format']: { type: 'json_object' },
            temperature: 0.2
          }),
          cache: 'no-store',
          signal: AbortSignal.timeout(45_000)
        });
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
            ? 'OpenAI rejected the saved API key. Check it in provider settings.'
            : response.status === 429
              ? 'OpenAI rate limit or quota reached. Check the project quota and try again later.'
              : `OpenAI could not process the capture (HTTP ${response.status}). Try again or create the card manually.`;
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
      if (!isRecord(payload) || !Array.isArray(payload.choices))
        throw invalidProviderResponse();
      const message = payload.choices[0];
      if (
        !isRecord(message) ||
        !isRecord(message.message) ||
        typeof message.message.content !== 'string'
      )
        throw invalidProviderResponse();
      let decoded: unknown;
      try {
        decoded = JSON.parse(message.message.content);
      } catch {
        throw invalidProviderResponse();
      }
      return normalizeGeminiCaptureResponse({
        candidates: [
          { content: { parts: [{ text: JSON.stringify(decoded) }] } }
        ]
      });
    }
  };
}

function buildCapturePrompt(input: CardCaptureInput): string {
  const guidance =
    'Extract up to 20 useful English words or phrases for a Spanish-speaking learner. Return only JSON with a top-level candidates array. Each candidate has word, optional original, meaning, phonetics, example, partOfSpeech, and exactly two relatedWords. Use a concise Spanish meaning, IPA pronunciation, one natural English example, and a supported Spanish part of speech. Correct spelling when appropriate and put source spelling in original; omit original when no correction is needed. Do not invent unreadable words. If no clear vocabulary can be identified, return an empty candidates array.';
  return input.kind === 'text'
    ? `${guidance}\n\nUser vocabulary input:\n${input.text}`
    : `${guidance}\n\nIdentify visible vocabulary in this image.`;
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
