'use client';

import { useSyncExternalStore } from 'react';

// Phone layout of Mi mazo (the CSS breakpoint is 761px).
const COMPACT_QUERY = '(max-width: 760px)';

function subscribe(onChange: () => void) {
  const query = window.matchMedia(COMPACT_QUERY);
  query.addEventListener('change', onChange);
  return () => query.removeEventListener('change', onChange);
}

function getSnapshot() {
  return window.matchMedia(COMPACT_QUERY).matches;
}

// The server and the first client render assume a wide screen, so hydration
// matches; the phone layout takes over right after.
export function useCompactViewport() {
  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}
