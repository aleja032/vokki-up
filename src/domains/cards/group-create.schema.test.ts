import { describe, expect, it } from 'vitest';
import { createGroupCreateSchema } from './group-create.schema';
import { cardsValidationMessages } from './validation-messages';

const schema = createGroupCreateSchema(['Laboral', 'Vida diaria']);

const validInput = { name: 'Viajes', description: '', tone: 'coral' };

describe('createGroupCreateSchema', () => {
  it('accepts a valid group and trims name and description', () => {
    const result = schema.safeParse({
      name: '  Viajes  ',
      description: '  Para el verano  ',
      tone: 'teal'
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual({
        name: 'Viajes',
        description: 'Para el verano',
        tone: 'teal'
      });
    }
  });

  it('rejects an empty or whitespace-only name', () => {
    for (const name of ['', '   ']) {
      const result = schema.safeParse({ ...validInput, name });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.code).toBe('too_small');
        expect(result.error.issues[0]?.message).toBe(
          cardsValidationMessages.groupNameRequired
        );
      }
    }
  });

  it('accepts a name of exactly 30 characters and rejects 31', () => {
    expect(
      schema.safeParse({ ...validInput, name: 'a'.repeat(30) }).success
    ).toBe(true);

    const result = schema.safeParse({ ...validInput, name: 'a'.repeat(31) });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe(
        'Usa como máximo 30 caracteres.'
      );
    }
  });

  it('rejects a duplicate name ignoring case and surrounding spaces', () => {
    const result = schema.safeParse({ ...validInput, name: '  laboral ' });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe(
        'Ya tienes un grupo llamado “laboral”.'
      );
    }
  });

  it('rejects an unknown tone', () => {
    expect(schema.safeParse({ ...validInput, tone: 'purple' }).success).toBe(
      false
    );
  });
});
