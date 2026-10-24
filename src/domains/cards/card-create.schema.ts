import { z } from 'zod';
import { cardsValidationMessages } from './validation-messages';

export const CARD_PARTS_OF_SPEECH = [
  'Sustantivo',
  'Verbo',
  'Adjetivo',
  'Adverbio',
  'Expresión'
] as const;

export const CARD_EXAMPLE_MAX_LENGTH = 160;

// Factory because the duplicate-term rule depends on the cards that exist.
export function createCardCreateSchema(existingTerms: readonly string[]) {
  const takenTerms = new Set(
    existingTerms.map(term => term.trim().toLocaleLowerCase())
  );

  return z.object({
    term: z
      .string()
      .trim()
      .min(1, { error: cardsValidationMessages.cardTermRequired })
      .refine(value => !takenTerms.has(value.toLocaleLowerCase()), {
        error: issue =>
          cardsValidationMessages.cardTermDuplicate(String(issue.input))
      }),
    meaning: z
      .string()
      .trim()
      .min(1, { error: cardsValidationMessages.cardMeaningRequired }),
    phonetics: z.string().trim(),
    // The length limit is checked on the raw value (as the counter shows it);
    // trimming happens afterwards.
    example: z
      .string()
      .max(CARD_EXAMPLE_MAX_LENGTH, {
        error: cardsValidationMessages.cardExampleTooLong
      })
      .trim(),
    partOfSpeech: z.enum(CARD_PARTS_OF_SPEECH, {
      error: cardsValidationMessages.cardCategoryInvalid
    }),
    groupId: z.string(),
    // The form keeps the raw comma-separated text; the schema outputs the list.
    tags: z.string().transform(value =>
      value
        .split(',')
        .map(tag => tag.trim())
        .filter(Boolean)
    )
  });
}

// Without existing cards: nothing can be a duplicate.
export const cardCreateSchema = createCardCreateSchema([]);

// Values held by the form (tags as text) and values after validation.
export type CardCreateFormValues = z.input<typeof cardCreateSchema>;
export type CardCreateInput = z.output<typeof cardCreateSchema>;
