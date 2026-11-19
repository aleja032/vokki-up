'use client';

import {
  BookOpenCheck,
  Clock3,
  Eye,
  Flame,
  Target,
  type LucideIcon
} from 'lucide-react';
import { StatCard } from '@/components/ui/stat-card';
import type { Tone } from '@/components/ui/tone.types';
import { useCountUp } from '@/lib/motion/use-count-up';
import { homeDashboardData } from '../data';
import type { HomeDashboardData } from '../types';
import './statistics-strip.css';

type StatKey = keyof HomeDashboardData['stats'];

const statistics: {
  key: StatKey;
  unitKey: 'streakDays' | 'weeklyMinutes' | null;
  suffix?: string;
  icon: LucideIcon;
  tone: Tone;
}[] = [
  { key: 'wordsSeen', unitKey: null, icon: Eye, tone: 'brand' },
  { key: 'masteredWords', unitKey: null, icon: BookOpenCheck, tone: 'mint' },
  { key: 'accuracy', unitKey: null, suffix: '%', icon: Target, tone: 'amber' },
  { key: 'streakDays', unitKey: 'streakDays', icon: Flame, tone: 'coral' },
  {
    key: 'weeklyMinutes',
    unitKey: 'weeklyMinutes',
    icon: Clock3,
    tone: 'brand'
  }
];

function StatValue({
  value,
  unit,
  suffix = ''
}: {
  value: number | null;
  unit: string;
  suffix?: string;
}) {
  const animated = useCountUp(value ?? 0);

  return (
    <>
      <span className="sr-only">
        {value === null
          ? 'Dato no disponible'
          : `${value}${suffix}${unit ? ` ${unit}` : ''}`}
      </span>
      <span aria-hidden="true">
        {value === null ? '—' : `${animated}${suffix}`}
        {value !== null && unit && <span> {unit}</span>}
      </span>
    </>
  );
}

export function StatisticsStrip({
  stats
}: {
  stats: HomeDashboardData['stats'];
}) {
  const { statisticsLabels, statisticsUnits, statisticsSectionLabel } =
    homeDashboardData.copy;

  return (
    <section
      aria-label={statisticsSectionLabel}
      className="statistics-strip"
      tabIndex={0}
    >
      {statistics
        // Accuracy only shows once there are reviews to measure.
        .filter(stat => stat.key !== 'accuracy' || stats.accuracy !== null)
        .map(stat => {
          const Icon = stat.icon;

          return (
            <StatCard
              className="progress-stat"
              icon={<Icon size={24} strokeWidth={2} />}
              key={stat.key}
              label={
                statisticsLabels[stat.key as keyof typeof statisticsLabels]
              }
              tone={stat.tone}
              value={
                <StatValue
                  suffix={stat.suffix}
                  unit={stat.unitKey ? statisticsUnits[stat.unitKey] : ''}
                  value={stats[stat.key]}
                />
              }
            />
          );
        })}
    </section>
  );
}
