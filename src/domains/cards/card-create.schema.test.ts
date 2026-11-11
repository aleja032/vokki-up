import { describe, expect, it } from 'vitest';
import { cardCreateSchema, createCardCreateSchema } from './card-create.schema';
import { cardsValidationMessages } from './validation-messages';

const validInput = {
  term: 'opportunity',
  meaning: 'Una buena ocasión',
  phonetics: '',
  example: '',
  partOfSpeech: 'Sustantivo',
  groupId: 'group-1',
  tags: ''
};

describe('cardCreateSchema', () => {
  it('accepts a valid card and trims text fields', () => {
    const result = cardCreateSchema.safeParse({
      ...validInput,
      term: '  opportunity ',
      meaning: ' Una buena ocasión  ',
      phonetics: ' /x/ ',
      example: ' An example. '
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.term).toBe('opportunity');
      expect(result.data.meaning).toBe('Una buena ocasión');
      expect(result.data.phonetics).toBe('/x/');
      expect(result.data.example).toBe('An example.');
    }
  });

  it('transforms the comma-separated tags into a trimmed string array', () => {
    const result = cardCreateSchema.safeParse({
      ...validInput,
      tags: ' trabajo, viajes ,, entrevistas ,'
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.tags).toEqual(['trabajo', 'viajes', 'entrevistas']);
    }
  });

  it('turns an empty or blank tags string into an empty array', () => {
    for (const tags of ['', '   ', ' , ,']) {
      const result = cardCreateSchema.safeParse({ ...validInput, tags });
      expect(result.success).toBe(true);
      if (result.success) expect(result.data.tags).toEqual([]);
    }
  });

  it('requires a non-blank term and meaning', () => {
    const termResult = cardCreateSchema.safeParse({
      ...validInput,
      term: '  '
    });
    expect(termResult.success).toBe(false);
    if (!termResult.success) {
      expect(termResult.error.issues[0]?.message).toBe(
        cardsValidationMessages.cardTermRequired
      );
    }

    const meaningResult = cardCreateSchema.safeParse({
      ...validInput,
      meaning: ''
    });
    expect(meaningResult.success).toBe(false);
    if (!meaningResult.success) {
      expect(meaningResult.error.issues[0]?.message).toBe(
        cardsValidationMessages.cardMeaningRequired
      );
    }
  });

  it('rejects an unknown part of speech', () => {
    expect(
      cardCreateSchema.safeParse({ ...validInput, partOfSpeech: 'Pronombre' })
        .success
    ).toBe(false);
  });

  it('allows an empty groupId when there are no groups', () => {
    expect(
      cardCreateSchema.safeParse({ ...validInput, groupId: '' }).success
    ).toBe(true);
  });

  it('rejects an example longer than 160 characters', () => {
    const tooLong = cardCreateSchema.safeParse({
      ...validInput,
      example: 'a'.repeat(161)
    });
    expect(tooLong.success).toBe(false);
    if (!tooLong.success) {
      expect(tooLong.error.issues[0]?.message).toBe(
        cardsValidationMessages.cardExampleTooLong
      );
      expect(tooLong.error.issues[0]?.path).toEqual(['example']);
    }

    expect(
      cardCreateSchema.safeParse({ ...validInput, example: 'a'.repeat(160) })
        .success
    ).toBe(true);
  });
});

describe('createCardCreateSchema', () => {
  const schema = createCardCreateSchema(['Opportunity', ' reliable ']);

  it('rejects a term that already exists, ignoring case and spaces', () => {
    for (const term of ['opportunity', '  OPPORTUNITY ', 'Reliable']) {
      const result = schema.safeParse({ ...validInput, term });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.path).toEqual(['term']);
        expect(result.error.issues[0]?.message).toBe(
          cardsValidationMessages.cardTermDuplicate(term.trim())
        );
      }
    }
  });

  it('accepts a term that is not in the deck', () => {
    expect(schema.safeParse({ ...validInput, term: 'deadline' }).success).toBe(
      true
    );
  });

  it('does not report a duplicate for an empty term', () => {
    const result = schema.safeParse({ ...validInput, term: ' ' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues).toHaveLength(1);
      expect(result.error.issues[0]?.message).toBe(
        cardsValidationMessages.cardTermRequired
      );
    }
  });
});
