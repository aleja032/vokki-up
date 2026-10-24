import { createLocalizedMessages } from '@/lib/i18n/locale';
export const authValidationMessages = createLocalizedMessages({
  emailRequired: 'Escribe tu correo electrónico.',
  emailInvalid: 'Revisa tu correo: parece que no es válido.',
  passwordRequired: 'Escribe tu contraseña.',
  passwordTooShort: 'Tu contraseña debe tener al menos 8 caracteres.'
});
