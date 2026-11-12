'use client';

import { useBrowserState } from '@/lib/storage/use-browser-state';
import {
  AI_USE_CARDS_STORAGE_KEY,
  getAiAvailability,
  isAiForCardsValue
} from './ai-for-cards.util';

/**
 * Reads the "Use AI for cards" setting. Until it is loaded the flag stays
 * enabled so the UI never flashes a disabled state.
 */
export function useAiForCardsEnabled(): {
  isEnabled: boolean;
  isLoaded: boolean;
} {
  const [isStoredEnabled, , isLoaded] = useBrowserState(
    AI_USE_CARDS_STORAGE_KEY,
    true,
    isAiForCardsValue
  );
  const availability = getAiAvailability({
    isEnabled: isStoredEnabled,
    isLoaded
  });
  return { isEnabled: availability !== 'disabled', isLoaded };
}
