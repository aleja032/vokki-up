import Link from 'next/link';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import './action-pill.css';

type ActionPillVariant = 'brand' | 'outline' | 'cta' | 'mint';

type ActionPillBaseProps = {
  children: ReactNode;
  variant?: ActionPillVariant;
  /** `sm` is the 44px compact size used inside lists and empty states. */
  size?: 'md' | 'sm';
  icon?: ReactNode;
  /** Trailing icon, e.g. the chevron of a menu button. */
  iconEnd?: ReactNode;
  className?: string;
  'aria-label'?: string;
};

type ActionPillLinkProps = ActionPillBaseProps & { href: string };

type ActionPillButtonProps = ActionPillBaseProps & {
  href?: undefined;
  onClick?: () => void;
  type?: 'button' | 'submit';
  disabled?: boolean;
  /** Set on buttons that open a menu. */
  'aria-haspopup'?: 'menu';
  'aria-expanded'?: boolean;
  'aria-controls'?: string;
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
    iconEnd,
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
      {iconEnd ? (
        <span aria-hidden="true" className="action-pill__icon">
          {iconEnd}
        </span>
      ) : null}
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
      aria-controls={props['aria-controls']}
      aria-expanded={props['aria-expanded']}
      aria-haspopup={props['aria-haspopup']}
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
