'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const DESKTOP_QUERY = '(min-width: 761px)';

/** Desktop opens the capture inside the Cards hub; deep links to /cards/ai keep working. */
export function AiDesktopRedirect() {
  const router = useRouter();
  useEffect(() => {
    if (window.matchMedia(DESKTOP_QUERY).matches) {
      router.replace('/cards?mode=image');
    }
  }, [router]);
  return null;
}
