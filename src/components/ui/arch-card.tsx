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
  /** Short facts line under the description, e.g. "200 palabras · 46 en tu mazo". */
  meta?: string;
  /** Accessible name of the bar, and the value shown next to it. */
  progress: { value: number; max: number; label: string };
  /** Pixel art of the card. Without it the card shows `icon`. */
  imageSrc?: string;
  icon?: ReactNode;
  /** In progress: the card gets the brand outline. */
  isActive?: boolean;
  /** Semantic accent of the bar and the state label. */
  accent?: 'brand' | 'mint' | 'amber' | 'lavender';
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
  meta,
  progress,
  imageSrc,
  icon,
  isActive = false,
  accent = 'brand',
  className
}: ArchCardProps) {
  return (
    <Link
      className={cn('arch-card', className)}
      data-accent={accent}
      data-art={imageSrc ? 'true' : 'false'}
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
        {meta ? <span className="arch-card__meta">{meta}</span> : null}
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
