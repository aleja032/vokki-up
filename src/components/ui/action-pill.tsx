import Link from 'next/link';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import './action-pill.css';

type ActionPillVariant = 'brand' | 'outline' | 'cta';

type ActionPillBaseProps = {
  children: ReactNode;
  variant?: ActionPillVariant;
  /** `sm` is the 44px compact size used inside lists and empty states. */
  size?: 'md' | 'sm';
  icon?: ReactNode;
  className?: string;
  'aria-label'?: string;
};

type ActionPillLinkProps = ActionPillBaseProps & { href: string };

type ActionPillButtonProps = ActionPillBaseProps & {
  href?: undefined;
  onClick?: () => void;
  type?: 'button' | 'submit';
  disabled?: boolean;
};

type ActionPillProps = ActionPillLinkProps | ActionPillButtonProps;

// Pill-shaped action: a button, or a link when `href` is given. `cta` is the
// mint gradient used for the primary "start reviewing" action.
export function ActionPill(props: ActionPillProps) {
  const {
    children,
    variant = 'outline',
    size = 'md',
    icon,
    className,
    'aria-label': ariaLabel
  } = props;
  const classes = cn(
    'action-pill',
    `action-pill--${variant}`,
    size === 'sm' && 'action-pill--sm',
    variant === 'cta' && 'motion-cta-pulse',
    className
  );
  const content = (
    <>
      {icon ? (
        <span aria-hidden="true" className="action-pill__icon">
          {icon}
        </span>
      ) : null}
      {children}
    </>
  );

  if (props.href !== undefined)
    return (
      <Link aria-label={ariaLabel} className={classes} href={props.href}>
        {content}
      </Link>
    );

  return (
    <button
      aria-label={ariaLabel}
      className={classes}
      disabled={props.disabled}
      onClick={props.onClick}
      type={props.type ?? 'button'}
    >
      {content}
    </button>
  );
}
