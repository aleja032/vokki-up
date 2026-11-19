import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import './chip.css';

type ChipProps = {
  children?: ReactNode;
  /** Toggle state. Leave undefined for chips that navigate instead of filter. */
  pressed?: boolean;
  /** `add` is the dashed round icon-only chip ("new group"). */
  variant?: 'filter' | 'add';
  icon?: ReactNode;
  title?: string;
  'aria-label'?: string;
  onClick: () => void;
  className?: string;
};

export function Chip({
  children,
  pressed,
  variant = 'filter',
  icon,
  title,
  'aria-label': ariaLabel,
  onClick,
  className
}: ChipProps) {
  return (
    <button
      aria-label={ariaLabel}
      aria-pressed={pressed}
      className={cn('chip', variant === 'add' && 'chip--add', className)}
      onClick={onClick}
      title={title}
      type="button"
    >
      {icon ? (
        <span aria-hidden="true" className="chip__icon">
          {icon}
        </span>
      ) : null}
      {children !== undefined ? (
        <span className="chip__label">{children}</span>
      ) : null}
    </button>
  );
}
