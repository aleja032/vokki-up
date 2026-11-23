import { SectionHeading } from '@/components/ui/section-heading';
import { cn } from '@/lib/utils';
import { homeDashboardData } from '../data';
import type { WeeklyActivity } from '../types';
import {
  COMPACT_LAYOUT,
  WIDE_LAYOUT,
  buildAreaPath,
  buildChartPoints,
  buildSmoothPath,
  type ChartLayout
} from './leaf-curve';
import './week-leaf-chart.css';

const { copy } = homeDashboardData;
const LEAF_PATH = 'M0 0 C 8 -11, 24 -11, 34 0 C 24 11, 8 11, 0 0 Z';

function LeafChart({
  days,
  layout,
  size
}: {
  days: WeeklyActivity[];
  layout: ChartLayout;
  size: 'wide' | 'compact';
}) {
  const points = buildChartPoints(
    days.map(day => day.count),
    layout
  );
  const max = Math.max(1, ...days.map(day => day.count));
  const summary = days.map(day => `${day.day} ${day.count}`).join(', ');
  const fillId = `week-leaf-fill-${size}`;

  return (
    <svg
      aria-label={`${copy.weeklyChartLabel}: ${summary}`}
      className={cn('week-leaf__chart', `week-leaf__chart--${size}`)}
      role="img"
      viewBox={`0 0 ${layout.width} ${layout.height}`}
    >
      <defs>
        <linearGradient id={fillId} x1="0" x2="0" y1="0" y2="1">
          <stop className="week-leaf__stop week-leaf__stop--top" offset="0" />
          <stop
            className="week-leaf__stop week-leaf__stop--bottom"
            offset="1"
          />
        </linearGradient>
      </defs>
      <path
        className="week-leaf__area"
        d={buildAreaPath(points, layout)}
        fill={`url(#${fillId})`}
      />
      <path
        className="week-leaf__baseline"
        d={`M22 ${layout.baselineY} L${layout.width - 22} ${layout.baselineY}`}
      />
      <path className="week-leaf__line" d={buildSmoothPath(points)} />
      {days.map((day, index) => {
        const { x, y } = points[index];
        const scale = 0.7 + 0.5 * (day.count / max);
        const angle = index % 2 === 0 ? -48 : -132;
        const label =
          size === 'compact' ? copy.weekdayInitial(day.day) : day.day;

        return (
          <g key={`${day.day}-${index}`}>
            {day.count === 0 ? (
              <circle className="week-leaf__empty" cx={x} cy={y} r="5" />
            ) : (
              <g
                className={day.isToday ? 'motion-glow' : undefined}
                transform={`translate(${x} ${y}) rotate(${angle}) scale(${scale.toFixed(2)})`}
              >
                <path
                  className="week-leaf__leaf"
                  d={LEAF_PATH}
                  data-today={day.isToday || undefined}
                />
                {day.isToday ? null : (
                  <path className="week-leaf__vein" d="M2 0 L28 0" />
                )}
              </g>
            )}
            {day.count > 0 ? (
              <text className="week-leaf__count" x={x} y={y - 26}>
                {day.count}
              </text>
            ) : null}
            <text
              className="week-leaf__day"
              data-today={day.isToday || undefined}
              x={x}
              y={layout.labelY}
            >
              {label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export function WeekLeafChart({ days }: { days: WeeklyActivity[] }) {
  return (
    <section aria-label={copy.weekHeading} className="week-leaf">
      <div>
        <SectionHeading pixel title={copy.weekHeading} />
        <p className="week-leaf__caption">{copy.weeklyChartCaption}</p>
      </div>
      <LeafChart days={days} layout={COMPACT_LAYOUT} size="compact" />
      <LeafChart days={days} layout={WIDE_LAYOUT} size="wide" />
    </section>
  );
}
