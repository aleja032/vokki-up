import type { AiSelection } from '../../lib/ai/catalog';

export type AiCapability = 'card-capture' | 'writing-feedback';

export type CardCaptureInput =
  | { kind: 'text'; text: string }
  | { kind: 'image'; mimeType: 'image/jpeg' | 'image/png'; base64: string };

export type CardCaptureRequest = {
  selection: AiSelection;
  input: CardCaptureInput;
};

export type CardCandidate = {
  word: string;
  meaning: string;
  phonetics: string;
  example: string;
  partOfSpeech: string;
  relatedWords: [string, string];
  fieldNotes: Partial<Record<keyof Omit<CardCandidate, 'fieldNotes'>, string>>;
};

export type CardCaptureResult = {
  mock: true;
  candidates: CardCandidate[];
  notice: string;
};

export type WritingFeedbackRequest = {
  selection: AiSelection;
  category: 'journal' | 'email' | 'story' | 'opinion';
  prompt: string;
  text: string;
};

export type WritingFeedbackResult = {
  mock: true;
  overallScore: number;
  metrics: {
    clarity: number;
    vocabulary: number;
    grammar: number;
  };
  summary: string;
  corrections: Array<{
    original: string;
    suggestion: string;
    explanation: string;
  }>;
};

export type AiErrorCode =
  | 'INVALID_REQUEST'
  | 'INVALID_SELECTION'
  | 'CAPABILITY_UNAVAILABLE'
  | 'INTERNAL_ERROR';

export type AiErrorResponse = {
  error: { code: AiErrorCode; message: string };
};

export class AiBoundaryError extends Error {
  constructor(
    public readonly code: AiErrorCode,
    message: string,
    public readonly status: number
  ) {
    super(message);
    this.name = 'AiBoundaryError';
  }
}

export interface AiCapabilityProvider {
  captureCards(input: CardCaptureInput): Promise<CardCaptureResult>;
  provideWritingFeedback(
    input: Omit<WritingFeedbackRequest, 'selection'>
  ): Promise<WritingFeedbackResult>;
}
