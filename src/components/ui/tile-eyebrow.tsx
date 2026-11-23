import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import './tile-eyebrow.css';

type TileEyebrowProps = {
  /** Category of the tile; truncates instead of overflowing. */
  label: string;
  /** Small icon before the label; a neutral dot is drawn when absent. */
  icon?: ReactNode;
  /** Quiet trailing slot (state pill, level diamonds). */
  trailing?: ReactNode;
  className?: string;
};

// Top row of a vocabulary tile: the category as a refined chip with a small
// icon or dot, and a quiet state on the right. Both sides stay inside the tile.
export function TileEyebrow({
  label,
  icon,
  trailing,
  className
}: TileEyebrowProps) {
  return (
    <div className={cn('tile-eyebrow', className)}>
      <span className="tile-eyebrow__chip">
        <span aria-hidden="true" className="tile-eyebrow__icon">
          {icon ?? <span className="tile-eyebrow__dot" />}
        </span>
        <span className="tile-eyebrow__label" title={label}>
          {label}
        </span>
      </span>
      {trailing ? (
        <span className="tile-eyebrow__trailing">{trailing}</span>
      ) : null}
    </div>
  );
}

type TileEyebrowStateProps = { children: ReactNode };

/** Quiet outlined pill used as the trailing state of a TileEyebrow. */
export function TileEyebrowState({ children }: TileEyebrowStateProps) {
  return <span className="tile-eyebrow__state">{children}</span>;
}
