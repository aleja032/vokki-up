export type Point = { x: number; y: number };

/** Geometry of one chart size. Empty days sit `lift` above the baseline. */
export type ChartLayout = {
  width: number;
  height: number;
  marginX: number;
  baselineY: number;
  lift: number;
  plotHeight: number;
  labelY: number;
};

/** Tablet and desktop chart (artboard 560 x 230). */
export const WIDE_LAYOUT: ChartLayout = {
  width: 560,
  height: 230,
  marginX: 36,
  baselineY: 196,
  lift: 14,
  plotHeight: 136,
  labelY: 220
};

/** Phone chart (artboard 350 x 190). */
export const COMPACT_LAYOUT: ChartLayout = {
  width: 350,
  height: 190,
  marginX: 36,
  baselineY: 156,
  lift: 14,
  plotHeight: 96,
  labelY: 180
};

export const CHART_WIDTH = WIDE_LAYOUT.width;
export const CHART_HEIGHT = WIDE_LAYOUT.height;
export const CHART_BASELINE_Y = WIDE_LAYOUT.baselineY;
export const CHART_EMPTY_Y = WIDE_LAYOUT.baselineY - WIDE_LAYOUT.lift;

/** One point per day: even spacing on x, taller counts sit higher on y. */
export function buildChartPoints(
  counts: number[],
  layout: ChartLayout = WIDE_LAYOUT
): Point[] {
  const max = Math.max(1, ...counts);
  const span = layout.width - layout.marginX * 2;
  const step = counts.length > 1 ? span / (counts.length - 1) : 0;

  return counts.map((count, index) => ({
    x: round(layout.marginX + step * index),
    y: round(layout.baselineY - layout.lift - (count / max) * layout.plotHeight)
  }));
}

function round(value: number): number {
  return Math.round(value * 10) / 10;
}

/** Smooth cubic path through the points (Catmull-Rom converted to Bezier). */
export function buildSmoothPath(points: Point[]): string {
  if (points.length === 0) return '';
  const [first, ...rest] = points;
  if (rest.length === 0) return `M${first.x} ${first.y}`;

  const segments = rest.map((end, index) => {
    const before = points[Math.max(index - 1, 0)];
    const start = points[index];
    const after = points[Math.min(index + 2, points.length - 1)];
    const c1x = start.x + (end.x - before.x) / 6;
    const c1y = start.y + (end.y - before.y) / 6;
    const c2x = end.x - (after.x - start.x) / 6;
    const c2y = end.y - (after.y - start.y) / 6;
    return `C${round(c1x)} ${round(c1y)}, ${round(c2x)} ${round(c2y)}, ${end.x} ${end.y}`;
  });

  return `M${first.x} ${first.y} ${segments.join(' ')}`;
}

/** Closed shape under the curve, used for the soft gradient fill. */
export function buildAreaPath(
  points: Point[],
  layout: ChartLayout = WIDE_LAYOUT
): string {
  if (points.length === 0) return '';
  const last = points[points.length - 1];
  return `${buildSmoothPath(points)} L${last.x} ${layout.baselineY} L${points[0].x} ${layout.baselineY} Z`;
}
