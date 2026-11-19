import { describe, expect, it } from 'vitest';
import {
  CHART_BASELINE_Y,
  buildAreaPath,
  buildChartPoints,
  buildSmoothPath
} from './leaf-curve';

describe('buildChartPoints', () => {
  it('spreads days evenly and puts higher counts higher up', () => {
    const points = buildChartPoints([0, 10, 5]);

    expect(points.map(point => point.x)).toEqual([36, 280, 524]);
    expect(points[0].y).toBe(CHART_BASELINE_Y);
    expect(points[1].y).toBeLessThan(points[2].y);
  });

  it('keeps a flat baseline when every day is empty', () => {
    const points = buildChartPoints([0, 0, 0]);

    expect(points.every(point => point.y === CHART_BASELINE_Y)).toBe(true);
  });
});

describe('paths', () => {
  const points = buildChartPoints([3, 8, 0, 5]);

  it('builds one cubic segment per gap between points', () => {
    const path = buildSmoothPath(points);

    expect(path.startsWith('M36 ')).toBe(true);
    expect(path.match(/C/g)).toHaveLength(3);
  });

  it('closes the area down to the baseline', () => {
    expect(buildAreaPath(points).endsWith('Z')).toBe(true);
  });

  it('returns an empty string without points', () => {
    expect(buildSmoothPath([])).toBe('');
    expect(buildAreaPath([])).toBe('');
  });
});
