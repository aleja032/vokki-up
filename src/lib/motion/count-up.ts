/** Exponential-feeling ease-out: fast start, soft landing (cubic). */
function easeOutCubic(progress: number): number {
  return 1 - (1 - progress) ** 3;
}

/**
 * Interpolates between two numbers with an ease-out curve.
 * Progress outside 0..1 is clamped so callers can pass raw elapsed ratios.
 */
export function computeCountUpValue(
  start: number,
  end: number,
  progress: number
): number {
  const clamped = Math.min(Math.max(progress, 0), 1);
  return start + (end - start) * easeOutCubic(clamped);
}
