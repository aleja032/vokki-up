export type Point = { x: number; y: number };

export const CHART_WIDTH = 560;
export const CHART_HEIGHT = 230;
const MARGIN_X = 36;
const BASELINE_Y = 196;
const PLOT_HEIGHT = 150;

/** One point per day: even spacing on x, taller counts sit higher on y. */
export function buildChartPoints(counts: number[]): Point[] {
  const max = Math.max(1, ...counts);
  const span = CHART_WIDTH - MARGIN_X * 2;
  const step = counts.length > 1 ? span / (counts.length - 1) : 0;

  return counts.map((count, index) => ({
    x: MARGIN_X + step * index,
    y: BASELINE_Y - (count / max) * PLOT_HEIGHT
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
export function buildAreaPath(points: Point[]): string {
  if (points.length === 0) return '';
  const last = points[points.length - 1];
  return `${buildSmoothPath(points)} L${last.x} ${BASELINE_Y} L${points[0].x} ${BASELINE_Y} Z`;
}

export const CHART_BASELINE_Y = BASELINE_Y;
