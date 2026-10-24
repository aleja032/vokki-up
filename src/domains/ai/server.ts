import { DEFAULT_AI_SELECTION, type AiSelection } from '@/lib/ai/catalog';
import { AiBoundaryError, type AiCapabilityProvider } from './types';
import { mockAiProvider } from './mock-provider';
import { validateAiSelection } from './validation';
import {
  createGeminiCardCaptureProvider,
  resolveGeminiSelection
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

export function getCardCaptureProvider(
  requestedSelection: AiSelection
): ReturnType<typeof createGeminiCardCaptureProvider> {
  const selection = resolveGeminiSelection(requestedSelection);
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) {
    throw new AiBoundaryError(
      'CAPABILITY_UNAVAILABLE',
      'Card capture is not configured. Add GEMINI_API_KEY on the server, then try again.',
      503
    );
  }
  return createGeminiCardCaptureProvider({
    apiKey,
    model: selection.model
  });
}
