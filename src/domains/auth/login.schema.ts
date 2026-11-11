import { z } from 'zod';
import { authValidationMessages } from './validation-messages';

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, authValidationMessages.emailRequired)
    .pipe(z.email(authValidationMessages.emailInvalid)),
  password: z
    .string()
    .min(1, authValidationMessages.passwordRequired)
    .min(8, authValidationMessages.passwordTooShort)
});

export type LoginInput = z.infer<typeof loginSchema>;
