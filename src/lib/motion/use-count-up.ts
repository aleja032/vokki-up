'use client';

import { useLayoutEffect, useRef, useState } from 'react';
import { computeCountUpValue } from './count-up';

interface CountUpOptions {
  durationMs?: number;
  /** Value to count from the first time the component mounts. */
  initialFrom?: number;
}

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

/**
 * Returns an integer that eases toward `value`.
 * The first render equals `value` (SSR/hydration safe); the animation starts in a layout effect (before paint, so no flash),
 * and is skipped entirely under `prefers-reduced-motion`.
 */
export function useCountUp(
  value: number,
  { durationMs = 600, initialFrom = 0 }: CountUpOptions = {}
): number {
  const [displayed, setDisplayed] = useState(value);
  const displayedRef = useRef(value);
  const isFirstRunRef = useRef(true);

  useLayoutEffect(() => {
    const isFirstRun = isFirstRunRef.current;
    isFirstRunRef.current = false;
    const start = isFirstRun ? initialFrom : displayedRef.current;
    const prefersReducedMotion = window.matchMedia(
      REDUCED_MOTION_QUERY
    ).matches;

    if (prefersReducedMotion || start === value) {
      displayedRef.current = value;
      setDisplayed(value);
      return;
    }

    let frame = 0;
    let startedAt: number | null = null;
    const tick = (now: number) => {
      startedAt ??= now;
      const progress = (now - startedAt) / durationMs;
      const next = Math.round(computeCountUpValue(start, value, progress));
      displayedRef.current = next;
      setDisplayed(next);
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    displayedRef.current = start;
    setDisplayed(start);
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value, durationMs, initialFrom]);

  return displayed;
}
