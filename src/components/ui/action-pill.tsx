import Link from 'next/link';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import './action-pill.css';

// The button hierarchy of the whole app (see odd/tasks/home-cards-design-d.md):
// primary = the one main forward action of a screen (mint gradient),
// secondary = outline, tertiary = text link, danger = destructive confirms.
export type ActionPillVariant = 'primary' | 'secondary' | 'tertiary' | 'danger';
export type ActionPillSize = 'md' | 'sm';

type ActionPillBaseProps = {
  children: ReactNode;
  variant?: ActionPillVariant;
  /** `sm` is the 44px compact size used inside lists and empty states. */
  size?: ActionPillSize;
  /** Soft glow loop for the single most important primary of a screen. */
  pulse?: boolean;
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

// Pill-shaped action: a button, or a link when `href` is given.
export function ActionPill(props: ActionPillProps) {
  const {
    children,
    variant = 'secondary',
    pulse = false,
    size = 'md',
    icon,
    iconEnd,
    className,
    'aria-label': ariaLabel
  } = props;
  const classes = cn(
    actionPillClass(variant, size),
    pulse && variant === 'primary' && 'motion-cta-pulse',
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

/** Classes of a hierarchy variant, for native elements that cannot be an ActionPill. */
export function actionPillClass(
  variant: ActionPillVariant = 'secondary',
  size: ActionPillSize = 'md'
) {
  return cn(
    'action-pill',
    `action-pill--${variant}`,
    size === 'sm' && 'action-pill--sm'
  );
}
