import { describe, expect, it } from 'vitest';
import {
  CHART_BASELINE_Y,
  CHART_EMPTY_Y,
  COMPACT_LAYOUT,
  buildAreaPath,
  buildChartPoints,
  buildSmoothPath
} from './leaf-curve';

describe('buildChartPoints', () => {
  it('spreads days evenly and puts higher counts higher up', () => {
    const points = buildChartPoints([0, 10, 5]);

    expect(points.map(point => point.x)).toEqual([36, 280, 524]);
    expect(points[0].y).toBe(CHART_EMPTY_Y);
    expect(points[1].y).toBeLessThan(points[2].y);
  });

  it('keeps a flat line above the baseline when every day is empty', () => {
    const points = buildChartPoints([0, 0, 0]);

    expect(points.every(point => point.y === CHART_EMPTY_Y)).toBe(true);
    expect(CHART_EMPTY_Y).toBeLessThan(CHART_BASELINE_Y);
  });

  it('matches the artboard points on the phone layout', () => {
    const points = buildChartPoints([14, 20, 0, 6], COMPACT_LAYOUT);

    expect(points[0]).toEqual({ x: 36, y: 74.8 });
    expect(points[1].y).toBe(46);
    expect(points[2].y).toBe(142);
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
