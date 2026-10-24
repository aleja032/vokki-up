import type { CSSProperties } from 'react';
import Link from 'next/link';
import { BookOpenCheck, Eye, Flame } from 'lucide-react';
import { homeDashboardData } from '../data';
import type { HomeDashboardData } from '../types';
import { ProgressRing } from './progress-ring';

const { copy } = homeDashboardData;

export function WeekOverviewCard({ data }: { data: HomeDashboardData }) {
  const { progress, stats } = data;
  const metrics = [
    {
      key: 'streak',
      icon: Flame,
      tone: 'amber',
      value: stats.streakDays,
      label: copy.streakMetricLabel
    },
    {
      key: 'seen',
      icon: Eye,
      tone: 'indigo',
      value: stats.wordsSeen,
      label: copy.seenMetricLabel
    },
    {
      key: 'mastered',
      icon: BookOpenCheck,
      tone: 'green',
      value: stats.masteredWords,
      label: copy.masteredMetricLabel
    }
  ] as const;

  return (
    <section
      aria-labelledby="week-overview-title"
      className="week-overview card-surface"
    >
      <div className="section-heading">
        <h2 id="week-overview-title">{copy.weekHeading}</h2>
        <Link href="#">{copy.statisticsLink}</Link>
      </div>
      <div className="week-overview__summary">
        <ProgressRing
          ariaLabel={copy.progressLabel(progress.completed, progress.target)}
          caption={copy.completedToday(progress.target)}
          completed={progress.completed}
          dashArray={progress.ringDashArray}
          variant="overview"
        />
        <ul className="week-overview__metrics">
          {metrics.map(metric => {
            const Icon = metric.icon;

            return (
              <li key={metric.key}>
                <span
                  aria-hidden="true"
                  className="week-overview__icon"
                  data-tone={metric.tone}
                >
                  <Icon size={20} strokeWidth={1.8} />
                </span>
                <strong>{metric.value ?? '—'}</strong>
                <span>{metric.label}</span>
              </li>
            );
          })}
        </ul>
      </div>
      <div
        aria-label={copy.weeklyChartLabel}
        className="week-overview__chart"
        role="img"
      >
        {progress.weeklyActivity.map(day => (
          <div className="week-overview__day" key={day.day}>
            <span
              aria-hidden="true"
              className="week-overview__bar"
              data-today={day.isToday || undefined}
              style={{ '--day-count': day.count } as CSSProperties}
            />
            <span
              className="week-overview__label"
              data-today={day.isToday || undefined}
            >
              {copy.weekdayInitial(day.day)}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
