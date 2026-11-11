import { BookOpenCheck, Clock3, Eye, Flame } from 'lucide-react';
import type { HomeDashboardData } from '../types';
import { homeDashboardData } from '../data';

const statistics = [
  {
    key: 'streakDays',
    labelKey: 'streakDays',
    unitKey: 'streakDays',
    icon: Flame,
    tone: 'amber'
  },
  {
    key: 'wordsSeen',
    labelKey: 'wordsSeen',
    unitKey: null,
    icon: Eye,
    tone: 'indigo'
  },
  {
    key: 'masteredWords',
    labelKey: 'masteredWords',
    unitKey: null,
    icon: BookOpenCheck,
    tone: 'green'
  },
  {
    key: 'weeklyMinutes',
    labelKey: 'weeklyMinutes',
    unitKey: 'weeklyMinutes',
    icon: Clock3,
    tone: 'blue'
  }
] as const;

export function StatisticsStrip({
  stats
}: {
  stats: HomeDashboardData['stats'];
}) {
  return (
    <section
      aria-label={homeDashboardData.copy.statisticsSectionLabel}
      className="statistics-strip"
      tabIndex={0}
    >
      {statistics.map(stat => {
        const Icon = stat.icon;
        const value = stats[stat.key];
        const unit = stat.unitKey
          ? homeDashboardData.copy.statisticsUnits[stat.unitKey]
          : '';

        return (
          <article className="stat-card card-surface" key={stat.key}>
            <span
              aria-hidden="true"
              className="stat-card__icon"
              data-tone={stat.tone}
            >
              <Icon size={21} strokeWidth={1.8} />
            </span>
            <strong className="stat-card__value">
              <span className="sr-only">
                {value === null
                  ? 'Dato no disponible'
                  : `${value}${unit ? ` ${unit}` : ''}`}
              </span>
              <span aria-hidden="true">
                {value === null ? '—' : value}
                {value !== null && unit && <span> {unit}</span>}
              </span>
            </strong>
            <span className="stat-card__label">
              {homeDashboardData.copy.statisticsLabels[stat.labelKey]}
            </span>
          </article>
        );
      })}
    </section>
  );
}
