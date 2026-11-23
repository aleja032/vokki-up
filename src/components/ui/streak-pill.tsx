import { Flame } from 'lucide-react';
import { cn } from '@/lib/utils';
import { translateText } from '@/lib/i18n/locale';
import { Pill } from './pill';
import './streak-pill.css';

type StreakPillProps = {
  days: number;
  className?: string;
};

// Flame plus the day count; the spoken label carries the unit.
export function StreakPill({ days, className }: StreakPillProps) {
  return (
    <span
      aria-label={translateText(`Racha de ${days} días`)}
      className={cn('streak-pill', className)}
      role="img"
    >
      <Pill icon={<Flame size={18} strokeWidth={2.2} />} tone="soft">
        {days}
      </Pill>
    </span>
  );
}
