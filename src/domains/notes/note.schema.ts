import { z } from 'zod';
import { notesValidationMessages } from './validation-messages';

const categoryRequiredMessage = 'Escribe un nombre para la categoría.';
const categoryTooLongMessage = 'Usa 40 caracteres o menos.';
const categoryDuplicateMessage = 'Ya existe una categoría con ese nombre.';

// Title and body stay optional (empty allowed) and are never trimmed: the
// editor autosaves every keystroke, so the text must be kept as typed.
export const noteSchema = z.object({
  title: z.string(),
  category: z
    .string()
    .trim()
    .min(1, notesValidationMessages.categoryInvalid)
    .max(40, notesValidationMessages.categoryInvalid),
  body: z.string()
});

export type NoteInput = z.infer<typeof noteSchema>;

export const noteCategorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, categoryRequiredMessage)
    .max(40, categoryTooLongMessage)
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
    { path: ['name'], message: categoryDuplicateMessage }
  );
}

export type NoteCategoryInput = z.infer<typeof noteCategorySchema>;
