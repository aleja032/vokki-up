import type { CSSProperties } from 'react';
import { cn } from '@/lib/utils';
import type { Tone } from './tone.types';
import './progress-bar.css';

type ProgressBarProps = {
  /** Accessible name; the bar has no visible text of its own. */
  label: string;
  value: number;
  max?: number;
  tone?: Tone;
  /** When set, renders N discrete segments instead of a continuous fill. */
  segments?: number;
  /** Segment corner style: `pill` (default) or squared `blocks`. */
  shape?: 'pill' | 'blocks';
  /** Segmented only: index of the segment being worked on right now. */
  currentIndex?: number;
  className?: string;
};

// The continuous fill width is data, not style: one unitless custom property
// (--progress, 0-100) is the minimum needed because a percentage cannot be a
// finite set of classes. Segmented bars need no inline style at all.
type ProgressStyle = CSSProperties & { '--progress': number };

export function ProgressBar({
  label,
  value,
  max = 100,
  tone = 'brand',
  segments,
  shape = 'pill',
  currentIndex,
  className
}: ProgressBarProps) {
  const safeMax = max > 0 ? max : 100;
  const clamped = Math.min(Math.max(value, 0), safeMax);
  const percent = Math.round((clamped / safeMax) * 100);
  const isSegmented = segments !== undefined && segments > 0;
  const filled = isSegmented ? Math.round((clamped / safeMax) * segments) : 0;

  return (
    <div
      aria-label={label}
      aria-valuemax={safeMax}
      aria-valuemin={0}
      aria-valuenow={clamped}
      className={cn(
        'progress-bar',
        `progress-bar--${tone}`,
        isSegmented && 'progress-bar--segmented',
        isSegmented && shape === 'blocks' && 'progress-bar--blocks',
        className
      )}
      role="progressbar"
    >
      {isSegmented ? (
        Array.from({ length: segments }, (_, index) => (
          <span
            className="progress-bar__segment"
            data-current={index === currentIndex || undefined}
            data-filled={index < filled}
            key={index}
          />
        ))
      ) : (
        <span
          className="progress-bar__fill"
          style={{ '--progress': percent } as ProgressStyle}
        />
      )}
    </div>
  );
}
