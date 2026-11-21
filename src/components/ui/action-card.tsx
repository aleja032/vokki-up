import Link from 'next/link';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import './action-card.css';

type ActionCardBaseProps = {
  /** `solid` is the inverted primary card, `outline` the quiet one. */
  variant?: 'solid' | 'outline';
  icon: ReactNode;
  title: string;
  subtitle: string;
  className?: string;
};

type ActionCardLinkProps = ActionCardBaseProps & { href: string };

type ActionCardButtonProps = ActionCardBaseProps & {
  href?: undefined;
  onClick: () => void;
};

type ActionCardProps = ActionCardLinkProps | ActionCardButtonProps;

// Square action tile of the phone layouts: an icon over a title and a short
// hint. A link when `href` is given, a button otherwise.
export function ActionCard(props: ActionCardProps) {
  const { variant = 'outline', icon, title, subtitle, className } = props;
  const classes = cn('action-card', `action-card--${variant}`, className);
  const content = (
    <>
      <span aria-hidden="true" className="action-card__icon">
        {icon}
      </span>
      <span className="action-card__copy">
        <b className="action-card__title">{title}</b>
        <span className="action-card__subtitle">{subtitle}</span>
      </span>
    </>
  );

  if (props.href !== undefined)
    return (
      <Link className={classes} href={props.href}>
        {content}
      </Link>
    );

  return (
    <button className={classes} onClick={props.onClick} type="button">
      {content}
    </button>
  );
}
