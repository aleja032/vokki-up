import { describe, expect, it } from 'vitest';
import { createGroupEditSchema } from './group-edit.schema';
import { cardsValidationMessages } from './validation-messages';

const schema = createGroupEditSchema(['Laboral', 'Vida diaria']);

describe('createGroupEditSchema', () => {
  it('accepts a new name and color and trims the name', () => {
    const result = schema.safeParse({ name: '  Viajes  ', tone: 'teal' });
    expect(result.success).toBe(true);
    if (result.success)
      expect(result.data).toEqual({ name: 'Viajes', tone: 'teal' });
  });

  it('rejects an empty or whitespace-only name', () => {
    for (const name of ['', '   ']) {
      const result = schema.safeParse({ name, tone: 'teal' });
      expect(result.success).toBe(false);
      if (!result.success)
        expect(result.error.issues[0]?.message).toBe(
          cardsValidationMessages.groupNameRequired
        );
    }
  });

  it('accepts 30 characters and rejects 31', () => {
    expect(
      schema.safeParse({ name: 'a'.repeat(30), tone: 'gray' }).success
    ).toBe(true);
    const result = schema.safeParse({ name: 'a'.repeat(31), tone: 'gray' });
    expect(result.success).toBe(false);
    if (!result.success)
      expect(result.error.issues[0]?.message).toBe(
        cardsValidationMessages.groupNameTooLong
      );
  });

  it('rejects the name of another folder, ignoring case and spaces', () => {
    for (const name of ['Laboral', '  laboral ', 'VIDA DIARIA']) {
      const result = schema.safeParse({ name, tone: 'green' });
      expect(result.success).toBe(false);
      if (!result.success)
        expect(result.error.issues[0]?.message).toBe(
          cardsValidationMessages.groupNameDuplicate(name.trim())
        );
    }
  });

  it('only accepts a color of the closed palette', () => {
    for (const tone of ['amber', 'coral', 'red', ''])
      expect(schema.safeParse({ name: 'Viajes', tone }).success).toBe(false);
    for (const tone of ['indigo', 'lavender', 'blue', 'teal', 'green', 'gray'])
      expect(schema.safeParse({ name: 'Viajes', tone }).success).toBe(true);
  });
});
