import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import type { Tone } from './tone.types';
import './stat-card.css';

type StatCardProps = {
  value: ReactNode;
  label: string;
  icon?: ReactNode;
  tone?: Tone;
  /** `soft` is the borderless tinted tile used on the round results. */
  variant?: 'outline' | 'soft';
  className?: string;
};

export function StatCard({
  value,
  label,
  icon,
  tone = 'brand',
  variant = 'outline',
  className
}: StatCardProps) {
  return (
    <article
      className={cn(
        'stat-tile',
        `stat-tile--${tone}`,
        variant === 'soft' && 'stat-tile--soft',
        className
      )}
    >
      {icon ? (
        <span aria-hidden="true" className="stat-tile__icon">
          {icon}
        </span>
      ) : null}
      <strong className="stat-tile__value">{value}</strong>
      <span className="stat-tile__label">{label}</span>
    </article>
  );
}
