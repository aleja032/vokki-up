/** localStorage key of the "Use AI for cards" setting (written by Settings). */
export const AI_USE_CARDS_STORAGE_KEY = 'settings/ai-use-cards';

export type AiAvailability = 'enabled' | 'disabled' | 'loading';

export function isAiForCardsValue(value: unknown): value is boolean {
  return typeof value === 'boolean';
}

/** While the stored value is unread, AI is treated as available by callers. */
export function getAiAvailability({
  isEnabled,
  isLoaded
}: {
  isEnabled: boolean;
  isLoaded: boolean;
}): AiAvailability {
  if (!isLoaded) return 'loading';
  return isEnabled ? 'enabled' : 'disabled';
}
