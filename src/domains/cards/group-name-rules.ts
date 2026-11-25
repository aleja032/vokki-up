/** Longest folder name (the counter of the create form shows the same limit). */
export const GROUP_NAME_MAX_LENGTH = 30;

/** Normal form used to compare folder names: trimmed, case-insensitive. */
export function normalizeGroupName(name: string) {
  return name.trim().toLocaleLowerCase();
}
