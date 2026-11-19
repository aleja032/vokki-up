import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import type { PillTone } from './tone.types';
import './pill.css';

type PillProps = {
  children: ReactNode;
  tone?: PillTone;
  icon?: ReactNode;
  className?: string;
};

export function Pill({
  children,
  tone = 'neutral',
  icon,
  className
}: PillProps) {
  return (
    <span className={cn('pill', `pill--${tone}`, className)}>
      {icon ? (
        <span aria-hidden="true" className="pill__icon">
          {icon}
        </span>
      ) : null}
      {children}
    </span>
  );
}
