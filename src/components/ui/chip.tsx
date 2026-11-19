import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import './chip.css';

type ChipProps = {
  children?: ReactNode;
  /** Toggle state. Leave undefined for chips that navigate instead of filter. */
  pressed?: boolean;
  /** Tab semantics: selection is announced with aria-selected instead of aria-pressed. */
  tab?: { id: string; controls: string; selected: boolean };
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
  tab,
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
      aria-controls={tab?.controls}
      aria-pressed={tab ? undefined : pressed}
      aria-selected={tab?.selected}
      className={cn('chip', variant === 'add' && 'chip--add', className)}
      id={tab?.id}
      onClick={onClick}
      role={tab ? 'tab' : undefined}
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
