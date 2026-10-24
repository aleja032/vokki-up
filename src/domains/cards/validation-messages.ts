import { createLocalizedMessages } from '@/lib/i18n/locale';
export const cardsValidationMessages = createLocalizedMessages({
  groupNameRequired: 'Escribe un nombre para el grupo.',
  groupNameTooLong: 'Usa como máximo 30 caracteres.',
  groupNameDuplicate: (name: string) => `Ya tienes un grupo llamado “${name}”.`,
  groupToneInvalid: 'Elige un color válido.',
  cardTermRequired: 'Escribe la palabra o frase en inglés.',
  cardTermDuplicate: (term: string) => `Ya tienes “${term}” en tu mazo.`,
  cardMeaningRequired: 'Escribe el significado en español.',
  cardExampleTooLong: 'El ejemplo supera los 160 caracteres.',
  cardCategoryInvalid: 'Elige una categoría válida.'
});
