import { homeDashboardData } from '../data';
import type { HomeDashboardData } from '../types';
import { ProgressRing } from './progress-ring';

const { copy } = homeDashboardData;

export function TodayGoalCard({
  progress
}: {
  progress: HomeDashboardData['progress'];
}) {
  const remaining = Math.max(progress.target - progress.completed, 0);

  return (
    <section
      aria-labelledby="today-goal-title"
      className="today-goal card-surface"
    >
      <h2 id="today-goal-title">{copy.goalHeading}</h2>
      <ProgressRing
        ariaLabel={copy.progressLabel(progress.completed, progress.target)}
        caption={copy.completedCards(progress.target)}
        completed={progress.completed}
        dashArray={progress.ringDashArray}
        variant="goal"
      />
      <p>{copy.goalRemaining(remaining)}</p>
    </section>
  );
}
