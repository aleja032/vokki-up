import { z } from 'zod';
import { FOLDER_COLORS } from './group-colors';
import { GROUP_NAME_MAX_LENGTH, normalizeGroupName } from './group-name-rules';
import { cardsValidationMessages } from './validation-messages';

// Factory because the duplicate-name rule depends on the other folders.
export function createGroupEditSchema(otherNames: readonly string[]) {
  const takenNames = new Set(otherNames.map(normalizeGroupName));

  return z.object({
    name: z
      .string()
      .max(GROUP_NAME_MAX_LENGTH, {
        error: () => cardsValidationMessages.groupNameTooLong
      })
      .trim()
      .min(1, { error: () => cardsValidationMessages.groupNameRequired })
      .refine(value => !takenNames.has(normalizeGroupName(value)), {
        error: issue =>
          cardsValidationMessages.groupNameDuplicate(String(issue.input))
      }),
    tone: z.enum(FOLDER_COLORS, {
      error: () => cardsValidationMessages.groupToneInvalid
    })
  });
}

export type GroupEditInput = z.infer<ReturnType<typeof createGroupEditSchema>>;
