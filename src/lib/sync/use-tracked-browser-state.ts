'use client';

import { useCallback, useEffect, useRef, type SetStateAction } from 'react';
import type { CreateSyncOperation } from '@/lib/sync/types';
import { enqueueLocalSyncOperation } from '@/lib/sync/local-queue';
import { installCardsSyncAutoDrain } from '@/lib/sync/cards-auto-sync';
import { useBrowserState } from '@/lib/storage/use-browser-state';

export type SyncChangeBuilder<T> = (
  previous: T,
  next: T
) => CreateSyncOperation[];

export function useTrackedBrowserState<T>(
  key: string,
  fallback: T,
  isValid: (value: unknown) => value is T,
  buildChanges: SyncChangeBuilder<T>
): [T, (value: SetStateAction<T>) => void, boolean] {
  const [value, setValue, isLoaded] = useBrowserState(key, fallback, isValid);
  const currentValue = useRef(value);

  useEffect(() => {
    installCardsSyncAutoDrain();
  }, []);

  useEffect(() => {
    currentValue.current = value;
  }, [value]);

  const setTrackedValue = useCallback(
    (action: SetStateAction<T>) => {
      const previous = currentValue.current;
      const next =
        typeof action === 'function'
          ? (action as (current: T) => T)(previous)
          : action;
      currentValue.current = next;
      setValue(next);
      for (const operation of buildChanges(previous, next)) {
        enqueueLocalSyncOperation(operation);
      }
    },
    [buildChanges, setValue]
  );

  return [value, setTrackedValue, isLoaded];
}
