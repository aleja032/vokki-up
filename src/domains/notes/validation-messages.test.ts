import { afterEach, describe, expect, it } from 'vitest';
import { setAppLanguage } from '@/lib/i18n/locale';
import { createNoteCategorySchema } from './note.schema';

describe('note category schema messages', () => {
  afterEach(() => setAppLanguage('Español'));

  it('validates in the language active at validation time', () => {
    const schema = createNoteCategorySchema(['General']);
    const spanish = schema.safeParse({ name: 'general' }).error?.issues[0]
      .message;
    setAppLanguage('English');
    const english = schema.safeParse({ name: 'general' }).error?.issues[0]
      .message;

    expect(spanish).toBe('Ya existe una categoría con ese nombre.');
    expect(english).toBe('A category with that name already exists.');
  });
});
