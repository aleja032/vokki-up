import { FEATURES } from '@/config/features';
import { translateText } from '@/lib/i18n/locale';
import { homeDashboardData } from './data';
import type { HomeSummary } from './home-summary.types';
import type { HomeDashboardData } from './types';

export function deriveHomeDashboardData(
  summary: HomeSummary
): HomeDashboardData {
  const { totalDue, newCount, pendingCount, completed } = summary;
  const target = homeDashboardData.progress.target;
  const circumference = 2 * Math.PI * 34;
  const completion = Math.min(completed / target, 1);
  const activities = homeDashboardData.activities
    .filter(activity => FEATURES.writing || activity.icon !== 'writing')
    .map(activity =>
      activity.icon === 'cards'
        ? {
            ...activity,
            description: translateText(
              `${totalDue} pendientes · disponible offline`
            )
          }
        : activity
    );

  return {
    ...homeDashboardData,
    activities,
    stats: {
      streakDays: summary.streakDays,
      wordsSeen: summary.wordsSeen,
      masteredWords: summary.masteredWords,
      weeklyMinutes: summary.weeklyMinutes
    },
    nextSession: {
      ...homeDashboardData.nextSession,
      title: translateText(
        totalDue ? `Repasar ${totalDue} tarjetas` : 'Todo al día'
      ),
      pendingCount,
      newCount,
      estimatedMinutes: Math.ceil(totalDue / 2)
    },
    progress: {
      ...homeDashboardData.progress,
      completed,
      ringDashArray: `${circumference * completion} ${circumference}`,
      weeklyActivity: summary.weeklyActivity
    }
  };
}
