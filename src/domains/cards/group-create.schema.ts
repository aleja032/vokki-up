import { z } from 'zod';
import { FOLDER_COLORS } from './group-colors';
import { GROUP_NAME_MAX_LENGTH } from './group-name-rules';
import { cardsValidationMessages } from './validation-messages';

// Factory because the duplicate-name rule depends on the groups that exist.
export function createGroupCreateSchema(existingNames: readonly string[]) {
  const takenNames = new Set(
    existingNames.map(name => name.trim().toLocaleLowerCase())
  );

  return z.object({
    // The length limit is checked on the raw value (as the counter shows it);
    // trimming happens afterwards.
    name: z
      .string()
      .max(GROUP_NAME_MAX_LENGTH, {
        error: () => cardsValidationMessages.groupNameTooLong
      })
      .trim()
      .min(1, { error: () => cardsValidationMessages.groupNameRequired })
      .refine(value => !takenNames.has(value.toLocaleLowerCase()), {
        error: issue =>
          cardsValidationMessages.groupNameDuplicate(String(issue.input))
      }),
    description: z.string().trim(),
    tone: z.enum(FOLDER_COLORS, {
      error: () => cardsValidationMessages.groupToneInvalid
    })
  });
}

export type GroupCreateInput = z.infer<
  ReturnType<typeof createGroupCreateSchema>
>;
