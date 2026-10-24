import { DEFAULT_AI_SELECTION, type AiSelection } from '@/lib/ai/catalog';
import { mockAiProvider } from './mock-provider';
import { AiBoundaryError, type AiCapabilityProvider } from './types';
import { validateAiSelection } from './validation';

// Server entry point: do not import this module from client components.
export function resolveAiSelection(value: unknown): AiSelection {
  return validateAiSelection(value ?? DEFAULT_AI_SELECTION);
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
