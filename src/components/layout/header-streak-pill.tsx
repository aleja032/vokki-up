'use client';

import { StreakPill } from '@/components/ui/streak-pill';
import { deriveStreakDays, isStreakEventList } from '@/lib/home/derive-streak';
import { useBrowserState } from '@/lib/storage/use-browser-state';

// Reads the same local review events the home reads, so the number matches.
export function HeaderStreakPill() {
  const [events, , loaded] = useBrowserState(
    'cards/review-events',
    [] as { localDate: string; earnsDailyCredit: boolean }[],
    isStreakEventList
  );
  const days = loaded ? deriveStreakDays(events) : 0;

  return days > 0 ? <StreakPill days={days} /> : null;
}
