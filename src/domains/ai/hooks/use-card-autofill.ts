'use client';

import { useState } from 'react';
import { useAiForCardsEnabled } from '@/lib/settings/use-ai-for-cards-enabled';
import { AiRequestError, requestCardCapture } from '../client';
import { aiMessages } from '../messages';
import type { CardCandidate } from '../types';

const messages = aiMessages.autofill;

export type CardAutofillStatus = 'idle' | 'loading' | 'error' | 'unconfigured';

/**
 * Asks the existing card-capture pipeline about a single English term and
 * returns its candidate. Callers decide how to apply it.
 */
export function useCardAutofill() {
  const { isEnabled: isAiEnabled } = useAiForCardsEnabled();
  const [status, setStatus] = useState<CardAutofillStatus>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  async function suggest(term: string): Promise<CardCandidate | null> {
    const trimmed = term.trim();
    if (!trimmed || !isAiEnabled) return null;
    setErrorMessage('');
    if (!navigator.onLine) {
      setStatus('error');
      setErrorMessage(messages.offline);
      return null;
    }
    setStatus('loading');
    try {
      // One term in, so the pipeline answers with (at most) one candidate.
      const { candidates } = await requestCardCapture({
        kind: 'text',
        text: trimmed
      });
      const candidate = candidates[0];
      if (!candidate) {
        setStatus('error');
        setErrorMessage(messages.empty);
        return null;
      }
      setStatus('idle');
      return candidate;
    } catch (error) {
      if (error instanceof AiRequestError && error.code === 'AUTH_REQUIRED') {
        setStatus('unconfigured');
        setErrorMessage(messages.unconfigured);
        return null;
      }
      setStatus('error');
      setErrorMessage(
        error instanceof Error && error.message
          ? error.message
          : messages.failed
      );
      return null;
    }
  }

  function dismiss() {
    setStatus('idle');
    setErrorMessage('');
  }

  return { status, errorMessage, suggest, dismiss };
}
