'use client';

import { useCallback, useEffect, useSyncExternalStore } from 'react';
import {
  readBrowserValueResult,
  writeBrowserValue
} from '@/lib/storage/browser-storage';
import {
  DEFAULT_ROUND_SIZE,
  ROUND_SIZE_STORAGE_KEY,
  isRoundSize,
  type RoundSize
} from '../review-round-size';

// The round size picked on Mi mazo. One shared value (the dashboard counts
// with it, the header and the phone banner show and change it), kept in the
// browser so it survives reloads.
let currentSize: RoundSize = DEFAULT_ROUND_SIZE;
let isHydrated = false;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach(listener => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot() {
  return currentSize;
}

function getServerSnapshot() {
  return DEFAULT_ROUND_SIZE;
}

function hydrateFromStorage() {
  if (isHydrated) return;
  isHydrated = true;
  const stored = readBrowserValueResult(ROUND_SIZE_STORAGE_KEY);
  if (stored.status === 'valid' && isRoundSize(stored.value)) {
    currentSize = stored.value;
    emit();
  }
}

export function useReviewRoundSize(): [RoundSize, (size: RoundSize) => void] {
  const size = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  useEffect(() => {
    hydrateFromStorage();
  }, []);

  const setSize = useCallback((next: RoundSize) => {
    currentSize = next;
    isHydrated = true;
    writeBrowserValue(ROUND_SIZE_STORAGE_KEY, next);
    emit();
  }, []);

  return [size, setSize];
}
