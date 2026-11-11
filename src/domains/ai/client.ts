'use client';

import { DEFAULT_AI_SELECTION, type AiSelection } from '../../lib/ai/catalog';
import type {
  AiErrorCode,
  AiErrorResponse,
  CardCaptureInput,
  CardCaptureResult,
  WritingFeedbackRequest,
  WritingFeedbackResult
} from './types';
import { validateAiSelection } from './validation';
import { readBrowserValue } from '@/lib/storage/browser-storage';

/** Error from the AI boundary that keeps the machine code next to the message. */
export class AiRequestError extends Error {
  constructor(
    public readonly code: AiErrorCode | 'UNKNOWN',
    message: string
  ) {
    super(message);
    this.name = 'AiRequestError';
  }
}

let transientApiKey: string | null = null;

/** Keeps guest credentials in this tab's memory only; never writes them to browser storage. */
export function setTransientAiApiKey(value: string | null) {
  transientApiKey = value?.trim() || null;
}

export function readSavedAiSelection(): AiSelection {
  try {
    return validateAiSelection({
      provider:
        readBrowserValue('settings/provider') ?? DEFAULT_AI_SELECTION.provider,
      model: readBrowserValue('settings/model') ?? DEFAULT_AI_SELECTION.model
    });
  } catch {
    return DEFAULT_AI_SELECTION;
  }
}

export async function requestCardCapture(
  input: CardCaptureInput
): Promise<CardCaptureResult> {
  return requestCapability<CardCaptureResult>('/api/ai/card-capture', {
    selection: readSavedAiSelection(),
    ...(transientApiKey ? { apiKey: transientApiKey } : {}),
    input
  });
}

export async function requestWritingFeedback(
  request: Omit<WritingFeedbackRequest, 'selection'>
): Promise<WritingFeedbackResult> {
  return requestCapability<WritingFeedbackResult>('/api/ai/writing-feedback', {
    ...request,
    selection: readSavedAiSelection()
  });
}

async function requestCapability<T>(url: string, body: unknown): Promise<T> {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    cache: 'no-store'
  });
  const payload: unknown = await response.json();
  if (!response.ok) {
    const error = payload as AiErrorResponse;
    throw new AiRequestError(
      error.error?.code ?? 'UNKNOWN',
      error.error?.message ?? 'AI capability request failed.'
    );
  }
  return payload as T;
}
