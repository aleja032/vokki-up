import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import './location-crumb.css';

type LocationCrumbProps = {
  ariaLabel: string;
  /** The place the user can go back to ("Mundos"). */
  rootLabel: string;
  rootHref: string;
  /** Icon of the current place (folder, globe). */
  icon: ReactNode;
  /** Small kind label before the name ("Mundo"). */
  kindLabel?: string;
  currentLabel: string;
  /** Use on dark surfaces such as the world banner. */
  onHero?: boolean;
  className?: string;
};

// "Root > icon Kind: current" bar: the root is a link back, the current place
// is marked with aria-current and truncates instead of overflowing.
export function LocationCrumb({
  ariaLabel,
  rootLabel,
  rootHref,
  icon,
  kindLabel,
  currentLabel,
  onHero = false,
  className
}: LocationCrumbProps) {
  return (
    <nav
      aria-label={ariaLabel}
      className={cn(
        'location-crumb',
        onHero && 'location-crumb--on-hero',
        className
      )}
    >
      <Link className="location-crumb__root" href={rootHref}>
        <ChevronLeft aria-hidden="true" size={16} />
        {rootLabel}
      </Link>
      <ChevronRight
        aria-hidden="true"
        className="location-crumb__sep"
        size={16}
      />
      <span aria-current="location" className="location-crumb__here">
        <span aria-hidden="true" className="location-crumb__icon">
          {icon}
        </span>
        {kindLabel ? (
          <span className="location-crumb__kind">{kindLabel}</span>
        ) : null}
        <span className="location-crumb__name" title={currentLabel}>
          {currentLabel}
        </span>
      </span>
    </nav>
  );
}
