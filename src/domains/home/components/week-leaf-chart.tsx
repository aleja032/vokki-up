import { SectionHeading } from '@/components/ui/section-heading';
import { homeDashboardData } from '../data';
import type { WeeklyActivity } from '../types';
import {
  CHART_BASELINE_Y,
  CHART_HEIGHT,
  CHART_WIDTH,
  buildAreaPath,
  buildChartPoints,
  buildSmoothPath
} from './leaf-curve';
import './week-leaf-chart.css';

const { copy } = homeDashboardData;
const LEAF_PATH = 'M0 0 C 8 -11, 24 -11, 34 0 C 24 11, 8 11, 0 0 Z';
const LABEL_Y = 220;

export function WeekLeafChart({ days }: { days: WeeklyActivity[] }) {
  const points = buildChartPoints(days.map(day => day.count));
  const max = Math.max(1, ...days.map(day => day.count));
  const summary = days.map(day => `${day.day} ${day.count}`).join(', ');

  return (
    <section aria-label={copy.weekHeading} className="week-leaf">
      <div>
        <SectionHeading pixel title={copy.weekHeading} />
        <p className="week-leaf__caption">{copy.weeklyChartCaption}</p>
      </div>
      <svg
        aria-label={`${copy.weeklyChartLabel}: ${summary}`}
        className="week-leaf__chart"
        role="img"
        viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
      >
        <defs>
          <linearGradient id="week-leaf-fill" x1="0" x2="0" y1="0" y2="1">
            <stop className="week-leaf__stop week-leaf__stop--top" offset="0" />
            <stop
              className="week-leaf__stop week-leaf__stop--bottom"
              offset="1"
            />
          </linearGradient>
        </defs>
        <path className="week-leaf__area" d={buildAreaPath(points)} />
        <path
          className="week-leaf__baseline"
          d={`M22 ${CHART_BASELINE_Y} L${CHART_WIDTH - 22} ${CHART_BASELINE_Y}`}
        />
        <path className="week-leaf__line" d={buildSmoothPath(points)} />
        {days.map((day, index) => {
          const { x, y } = points[index];
          const scale = 0.7 + 0.5 * (day.count / max);
          const angle = index % 2 === 0 ? -48 : -132;

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
                y={LABEL_Y}
              >
                {day.day}
              </text>
            </g>
          );
        })}
      </svg>
    </section>
  );
}
