import type { CSSProperties } from 'react';
import { homeDashboardData } from '../data';
import type { HomeDashboardData } from '../types';

const { copy } = homeDashboardData;

export function WeeklyProgressCard({ data }: { data: HomeDashboardData }) {
  return (
    <section
      aria-labelledby="weekly-progress-title"
      className="weekly-progress card-surface"
    >
      <div className="section-heading">
        <h2 id="weekly-progress-title">{copy.weekHeading}</h2>
        <span className="weekly-progress__caption">
          {copy.weeklyChartCaption}
        </span>
      </div>
      <div aria-label={copy.weeklyChartLabel} className="week-chart" role="img">
        {data.progress.weeklyActivity.map(day => (
          <div className="week-chart__day" key={day.day}>
            <span
              className="week-chart__count"
              data-today={day.isToday || undefined}
            >
              {day.count || '—'}
            </span>
            <span
              aria-hidden="true"
              className="week-chart__bar"
              data-empty={day.count === 0 || undefined}
              data-today={day.isToday || undefined}
              style={{ '--day-count': day.count } as CSSProperties}
            />
            <span
              className="week-chart__label"
              data-today={day.isToday || undefined}
            >
              {day.day}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
