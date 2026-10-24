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
  const activities = homeDashboardData.activities.map(activity =>
    activity.icon === 'cards'
      ? {
          ...activity,
          description: `${totalDue} pendientes · disponible offline`
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
      title: totalDue ? `Repasar ${totalDue} tarjetas` : 'Todo al día',
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
