'use client';

import { useEffect, useState } from 'react';
import { readBrowserValue, writeBrowserValue } from './browser-storage';

export function useBrowserState<T>(
  key: string,
  fallback: T,
  isValid: (value: unknown) => value is T
): [T, (value: T | ((current: T) => T)) => void, boolean] {
  const [value, setValue] = useState(fallback);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let isMounted = true;
    queueMicrotask(() => {
      if (!isMounted) return;
      const storedValue = readBrowserValue(key);
      if (isValid(storedValue)) setValue(storedValue);
      setIsLoaded(true);
    });

    return () => {
      isMounted = false;
    };
  }, [isValid, key]);

  useEffect(() => {
    if (isLoaded) writeBrowserValue(key, value);
  }, [isLoaded, key, value]);

  return [value, setValue, isLoaded];
}
