import { describe, expect, it } from 'vitest';
import { computeCountUpValue } from './count-up';

describe('computeCountUpValue', () => {
  it('returns the start value at progress 0', () => {
    expect(computeCountUpValue(0, 120, 0)).toBe(0);
    expect(computeCountUpValue(40, 120, 0)).toBe(40);
  });

  it('returns the end value at progress 1', () => {
    expect(computeCountUpValue(0, 120, 1)).toBe(120);
  });

  it('eases out so the first half covers more than half of the distance', () => {
    expect(computeCountUpValue(0, 100, 0.5)).toBeCloseTo(87.5);
  });

  it('never decreases as progress grows', () => {
    const samples = [0, 0.1, 0.25, 0.5, 0.75, 0.9, 1].map(progress =>
      computeCountUpValue(0, 50, progress)
    );
    expect([...samples].sort((a, b) => a - b)).toEqual(samples);
  });

  it('clamps progress outside the 0..1 range', () => {
    expect(computeCountUpValue(10, 90, -1)).toBe(10);
    expect(computeCountUpValue(10, 90, 2)).toBe(90);
  });

  it('counts down when the end value is lower than the start', () => {
    expect(computeCountUpValue(100, 0, 0.5)).toBeCloseTo(12.5);
  });
});
