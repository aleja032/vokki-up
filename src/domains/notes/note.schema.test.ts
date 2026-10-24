import { describe, expect, it } from 'vitest';
import { noteSchema } from './note.schema';
import { notesValidationMessages } from './validation-messages';

describe('noteSchema', () => {
  it('allows an empty title and body', () => {
    const result = noteSchema.safeParse({
      title: '',
      category: 'Ideas',
      body: ''
    });

    expect(result.success).toBe(true);
  });

  it('keeps text exactly as typed without trimming', () => {
    const input = { title: ' Hola ', category: 'Cultura', body: 'texto \n' };
    const result = noteSchema.safeParse(input);

    expect(result.success).toBe(true);
    if (result.success) expect(result.data).toEqual(input);
  });

  it('accepts every note category', () => {
    for (const category of ['Expresiones', 'Gramática', 'Cultura', 'Ideas']) {
      expect(
        noteSchema.safeParse({ title: 't', category, body: 'b' }).success
      ).toBe(true);
    }
  });

  it('rejects an unknown category', () => {
    const result = noteSchema.safeParse({
      title: 't',
      category: 'Otra',
      body: 'b'
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe(
        notesValidationMessages.categoryInvalid
      );
    }
  });
});
