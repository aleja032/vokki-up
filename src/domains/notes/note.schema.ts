import { z } from 'zod';
import { notesValidationMessages } from './validation-messages';

// Title and body stay optional (empty allowed) and are never trimmed: the
// editor autosaves every keystroke, so the text must be kept as typed.
export const noteSchema = z.object({
  title: z.string(),
  category: z.enum(['Expresiones', 'Gramática', 'Cultura', 'Ideas'], {
    error: notesValidationMessages.categoryInvalid
  }),
  body: z.string()
});

export type NoteInput = z.infer<typeof noteSchema>;
