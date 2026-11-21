import Image from 'next/image';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { PixelLabel } from './pixel-label';
import { ProgressBar } from './progress-bar';
import './arch-card.css';

type ArchCardProps = {
  href: string;
  /** Small pixel label above the title, e.g. "EN CURSO". */
  stateLabel: string;
  title: string;
  description?: string;
  /** Accessible name of the bar, and the value shown next to it. */
  progress: { value: number; max: number; label: string };
  /** Pixel art of an active card. Without it the card shows `icon`. */
  imageSrc?: string;
  icon?: ReactNode;
  isActive?: boolean;
  className?: string;
};

// Link card with an arch-shaped top (proposal D, "Mundos"). Phones render a
// row with a small arch thumbnail; wider screens render the tall arch with the
// text over the art.
export function ArchCard({
  href,
  stateLabel,
  title,
  description,
  progress,
  imageSrc,
  icon,
  isActive = false,
  className
}: ArchCardProps) {
  return (
    <Link
      className={cn('arch-card', className)}
      data-state={isActive ? 'active' : 'idle'}
      href={href}
    >
      <span aria-hidden="true" className="arch-card__art">
        {imageSrc ? (
          <>
            <Image
              alt=""
              className="arch-card__image"
              fill
              sizes="(min-width: 640px) 25vw, 84px"
              src={imageSrc}
              unoptimized
            />
            <span className="arch-card__shade" />
          </>
        ) : (
          <span className="arch-card__icon">{icon}</span>
        )}
      </span>
      <span className="arch-card__body">
        <PixelLabel className="arch-card__state">{stateLabel}</PixelLabel>
        <span className="arch-card__title">{title}</span>
        {description ? (
          <span className="arch-card__description">{description}</span>
        ) : null}
        <span className="arch-card__progress">
          <ProgressBar
            className="arch-card__bar"
            label={progress.label}
            max={progress.max}
            value={progress.value}
          />
          <span className="arch-card__count">
            {progress.value}/{progress.max}
          </span>
        </span>
      </span>
    </Link>
  );
}
