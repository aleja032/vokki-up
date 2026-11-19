import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { PixelLabel } from './pixel-label';
import './section-heading.css';

type SectionHeadingProps = {
  title: string;
  kicker?: string;
  action?: ReactNode;
  as?: 'h2' | 'h3';
  /** Sets the title in the pixel font, uppercase, like a game label. */
  pixel?: boolean;
  className?: string;
};

// Named `section-title` in CSS: the global `.section-heading` rule belongs to
// the legacy home sections and must keep working unchanged.
export function SectionHeading({
  title,
  kicker,
  action,
  as: Heading = 'h2',
  pixel = false,
  className
}: SectionHeadingProps) {
  return (
    <header className={cn('section-title', className)}>
      <div className="section-title__copy">
        {kicker ? <PixelLabel>{kicker}</PixelLabel> : null}
        <Heading
          className={cn(
            'section-title__text',
            pixel && 'section-title__text--pixel'
          )}
        >
          {title}
        </Heading>
      </div>
      {action ? <div className="section-title__action">{action}</div> : null}
    </header>
  );
}
