import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import './folder-tile.css';

export type FolderTileTone =
  | 'indigo'
  | 'green'
  | 'amber'
  | 'blue'
  | 'teal'
  | 'coral'
  | 'gray';

type FolderTileProps = {
  /** `add` is the dashed empty folder that starts something new. */
  variant?: 'folder' | 'add';
  tone?: FolderTileTone;
  title: string;
  count?: number;
  subtitle?: string;
  icon: ReactNode;
  /** The selected folder lifts and gets the strong outline. */
  pressed?: boolean;
  'aria-label'?: string;
  onClick: () => void;
  className?: string;
};

// Folder-shaped tile (a tab on top of a rounded body): a group of things with
// its count, a title and a one-line hint.
export function FolderTile({
  variant = 'folder',
  tone = 'indigo',
  title,
  count,
  subtitle,
  icon,
  pressed,
  'aria-label': ariaLabel,
  onClick,
  className
}: FolderTileProps) {
  return (
    <button
      aria-label={ariaLabel}
      aria-pressed={pressed}
      className={cn(
        'folder-tile',
        variant === 'add' && 'folder-tile--add',
        className
      )}
      data-tone={tone}
      onClick={onClick}
      type="button"
    >
      <span aria-hidden="true" className="folder-tile__tab" />
      {variant === 'folder' ? (
        <span aria-hidden="true" className="folder-tile__tab-back" />
      ) : null}
      <span className="folder-tile__body">
        {variant === 'folder' ? (
          <>
            <span className="folder-tile__top">
              <span aria-hidden="true" className="folder-tile__icon">
                {icon}
              </span>
              <span className="folder-tile__count">{count}</span>
            </span>
            <span className="folder-tile__text">
              <b className="folder-tile__title">{title}</b>
              {subtitle ? (
                <span className="folder-tile__subtitle">{subtitle}</span>
              ) : null}
            </span>
          </>
        ) : (
          <>
            <span aria-hidden="true" className="folder-tile__icon">
              {icon}
            </span>
            {title}
          </>
        )}
      </span>
    </button>
  );
}
