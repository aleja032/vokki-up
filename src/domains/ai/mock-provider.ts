import type {
  AiCapabilityProvider,
  CardCaptureInput,
  CardCaptureResult,
  WritingFeedbackRequest,
  WritingFeedbackResult
} from './types';

export const mockAiProvider: AiCapabilityProvider = {
  async captureCards(input: CardCaptureInput): Promise<CardCaptureResult> {
    if (input.kind === 'image') {
      return {
        mock: true,
        candidates: [],
        notice:
          'Image recognition is not connected. Add cards manually or connect an authorized provider.'
      };
    }

    const word = input.text.trim();
    return {
      mock: true,
      candidates: [
        {
          word,
          meaning: '[Mock result — verify and enter a meaning]',
          phonetics: '[phonetics not generated]',
          example: '[Mock example — replace with a natural sentence]',
          partOfSpeech: '[select a part of speech]',
          relatedWords: ['[related word 1]', '[related word 2]'],
          fieldNotes: {
            meaning: 'No AI provider is connected; verify this field manually.',
            phonetics:
              'No AI provider is connected; enter pronunciation manually.',
            example: 'No AI provider is connected; write an example manually.',
            partOfSpeech:
              'No AI provider is connected; select a part of speech.',
            relatedWords:
              'No AI provider is connected; choose related words manually.'
          }
        }
      ],
      notice: 'Mock preview only. Review every field before creating a card.'
    };
  },

  async provideWritingFeedback(
    input: Omit<WritingFeedbackRequest, 'selection'>
  ): Promise<WritingFeedbackResult> {
    return {
      mock: true,
      overallScore: 0,
      metrics: { clarity: 0, vocabulary: 0, grammar: 0 },
      summary: `Mock feedback only for ${input.category}. No writing was analyzed by an AI provider.`,
      corrections: []
    };
  }
};
