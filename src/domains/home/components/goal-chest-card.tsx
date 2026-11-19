'use client';

import { Gift } from 'lucide-react';
import { PixelLabel } from '@/components/ui/pixel-label';
import { ProgressBar } from '@/components/ui/progress-bar';
import { useCountUp } from '@/lib/motion/use-count-up';
import { homeDashboardData } from '../data';
import type { HomeDashboardData } from '../types';
import './goal-chest-card.css';

const { copy } = homeDashboardData;
const GOAL_SEGMENTS = 10;

export function GoalChestCard({
  progress
}: {
  progress: HomeDashboardData['progress'];
}) {
  const { completed, target } = progress;
  const remaining = Math.max(target - completed, 0);
  const animated = useCountUp(completed, { durationMs: 700 });

  return (
    <section aria-labelledby="goal-title" className="goal-chest">
      <div className="goal-chest__header">
        <h2 className="goal-chest__title" id="goal-title">
          <PixelLabel className="goal-chest__label">
            {copy.goalHeading}
          </PixelLabel>
        </h2>
        <strong className="goal-chest__count">
          <span className="sr-only">{copy.goalCount(completed, target)}</span>
          <span aria-hidden="true">{copy.goalCount(animated, target)}</span>
        </strong>
      </div>
      <div className="goal-chest__row">
        <ProgressBar
          className="goal-chest__bar"
          label={copy.progressLabel(completed, target)}
          max={target}
          segments={GOAL_SEGMENTS}
          tone="amber"
          value={completed}
        />
        <span aria-hidden="true" className="goal-chest__chest">
          <Gift size={28} strokeWidth={1.8} />
        </span>
      </div>
      <p className="goal-chest__note">
        {remaining > 0 ? copy.goalRemaining(remaining) : copy.goalDone}
      </p>
    </section>
  );
}
