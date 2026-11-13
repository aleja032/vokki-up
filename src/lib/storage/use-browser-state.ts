'use client';

import { useEffect, useState } from 'react';
import { readBrowserValueResult, writeBrowserValue } from './browser-storage';

export function canPersistBrowserState<T>(
  result: ReturnType<typeof readBrowserValueResult>,
  isValid: (value: unknown) => value is T
): boolean {
  return (
    result.status === 'missing' ||
    (result.status === 'valid' && isValid(result.value))
  );
}

export function useBrowserState<T>(
  key: string,
  fallback: T,
  isValid: (value: unknown) => value is T
): [T, (value: T | ((current: T) => T)) => void, boolean] {
  const [value, setValue] = useState(fallback);
  const [isLoaded, setIsLoaded] = useState(false);
  const [canPersist, setCanPersist] = useState(false);

  useEffect(() => {
    let isMounted = true;
    queueMicrotask(() => {
      if (!isMounted) return;
      const result = readBrowserValueResult(key);
      if (result.status === 'valid' && isValid(result.value))
        setValue(result.value);
      setCanPersist(canPersistBrowserState(result, isValid));
      setIsLoaded(true);
    });

    return () => {
      isMounted = false;
    };
  }, [isValid, key]);

  useEffect(() => {
    if (isLoaded && canPersist) writeBrowserValue(key, value);
  }, [canPersist, isLoaded, key, value]);

  function setBrowserState(nextValue: T | ((current: T) => T)) {
    setCanPersist(true);
    setValue(nextValue);
  }

  return [value, setBrowserState, isLoaded];
}
