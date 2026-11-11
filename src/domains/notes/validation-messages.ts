import { createLocalizedMessages } from '@/lib/i18n/locale';
export const notesValidationMessages = createLocalizedMessages({
  categoryInvalid: 'Elige una categoría válida.',
  categoryRequired: 'Escribe un nombre para la categoría.',
  categoryTooLong: 'Usa 40 caracteres o menos.',
  categoryDuplicate: 'Ya existe una categoría con ese nombre.'
});
