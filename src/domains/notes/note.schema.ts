import { z } from 'zod';
import { notesValidationMessages } from './validation-messages';

// Title and body stay optional (empty allowed) and are never trimmed: the
// editor autosaves every keystroke, so the text must be kept as typed.
export const noteSchema = z.object({
  title: z.string(),
  category: z
    .string()
    .trim()
    .min(1, { error: () => notesValidationMessages.categoryInvalid })
    .max(40, { error: () => notesValidationMessages.categoryInvalid }),
  body: z.string()
});

export type NoteInput = z.infer<typeof noteSchema>;

export const noteCategorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { error: () => notesValidationMessages.categoryRequired })
    .max(40, { error: () => notesValidationMessages.categoryTooLong })
});

export function createNoteCategorySchema(
  categories: string[],
  editingCategory?: string | null
) {
  return noteCategorySchema.refine(
    ({ name }) =>
      !categories.some(
        category =>
          category !== editingCategory &&
          category.toLocaleLowerCase() === name.toLocaleLowerCase()
      ),
    { path: ['name'], error: () => notesValidationMessages.categoryDuplicate }
  );
}

export type NoteCategoryInput = z.infer<typeof noteCategorySchema>;
