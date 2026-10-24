import {
  AI_PROVIDER_CATALOG,
  type AiModelId,
  type AiProviderId,
  type AiSelection
} from '../../lib/ai/catalog';
import {
  AiBoundaryError,
  type CardCaptureRequest,
  type WritingFeedbackRequest
} from './types';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function validateAiSelection(value: unknown): AiSelection {
  if (
    !isRecord(value) ||
    !hasOnlyKeys(value, ['provider', 'model']) ||
    typeof value.provider !== 'string' ||
    typeof value.model !== 'string'
  ) {
    throw new AiBoundaryError(
      'INVALID_SELECTION',
      'Choose a supported provider and model.',
      400
    );
  }

  const provider = AI_PROVIDER_CATALOG.find(
    option => option.id === value.provider
  );
  if (!provider) {
    throw new AiBoundaryError(
      'INVALID_SELECTION',
      'Unsupported AI provider.',
      400
    );
  }
  if (!provider.models.some(model => model === value.model)) {
    throw new AiBoundaryError(
      'INVALID_SELECTION',
      'The selected model is not available for provider.',
      400
    );
  }

  return {
    provider: provider.id as AiProviderId,
    model: value.model as AiModelId
  };
}

export function validateCardCaptureRequest(value: unknown): CardCaptureRequest {
  if (!isRecord(value) || !hasOnlyKeys(value, ['selection', 'input']))
    throw invalidRequest();
  const selection = validateAiSelection(value.selection);
  if (
    !isRecord(value.input) ||
    typeof value.input.kind !== 'string' ||
    (value.input.kind === 'text' &&
      !hasOnlyKeys(value.input, ['kind', 'text'])) ||
    (value.input.kind === 'image' &&
      !hasOnlyKeys(value.input, ['kind', 'mimeType', 'base64']))
  ) {
    throw invalidRequest();
  }

  if (value.input.kind === 'text') {
    const text = value.input.text;
    if (typeof text !== 'string' || !text.trim() || text.length > 5000)
      throw invalidRequest();
    return { selection, input: { kind: 'text', text: text.trim() } };
  }

  if (value.input.kind === 'image') {
    const { mimeType, base64 } = value.input;
    if (
      (mimeType !== 'image/jpeg' && mimeType !== 'image/png') ||
      typeof base64 !== 'string' ||
      !base64.trim() ||
      base64.length > 2_800_000
    ) {
      throw invalidRequest();
    }
    return { selection, input: { kind: 'image', mimeType, base64 } };
  }
  throw invalidRequest();
}

export function validateWritingFeedbackRequest(
  value: unknown
): WritingFeedbackRequest {
  if (
    !isRecord(value) ||
    !hasOnlyKeys(value, ['selection', 'category', 'prompt', 'text'])
  ) {
    throw invalidRequest();
  }
  const selection = validateAiSelection(value.selection);
  const categories = ['journal', 'email', 'story', 'opinion'] as const;
  if (
    typeof value.category !== 'string' ||
    !categories.some(category => category === value.category) ||
    typeof value.prompt !== 'string' ||
    value.prompt.length > 1000 ||
    typeof value.text !== 'string' ||
    !value.text.trim() ||
    value.text.length > 10000
  ) {
    throw invalidRequest();
  }
  return {
    selection,
    category: value.category as WritingFeedbackRequest['category'],
    prompt: value.prompt.trim(),
    text: value.text.trim()
  };
}

function invalidRequest(): AiBoundaryError {
  return new AiBoundaryError(
    'INVALID_REQUEST',
    'The request is incomplete or invalid.',
    400
  );
}

function hasOnlyKeys(
  value: Record<string, unknown>,
  allowed: string[]
): boolean {
  return Object.keys(value).every(key => allowed.includes(key));
}
