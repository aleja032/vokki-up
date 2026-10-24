import type { ReactNode } from 'react';

type NoteIconProps = {
  size?: number;
  filled?: boolean;
};

type IconFrameProps = NoteIconProps & { children: ReactNode };

function IconFrame({ size = 20, filled = false, children }: IconFrameProps) {
  return (
    <svg
      aria-hidden="true"
      className="note-icon"
      data-filled={filled}
      height={size}
      viewBox="0 0 24 24"
      width={size}
    >
      {children}
    </svg>
  );
}

export function SearchIcon(props: NoteIconProps) {
  return (
    <IconFrame {...props}>
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-4-4" />
    </IconFrame>
  );
}

export function PlusIcon(props: NoteIconProps) {
  return (
    <IconFrame {...props}>
      <path d="M12 5v14M5 12h14" />
    </IconFrame>
  );
}

export function StarIcon(props: NoteIconProps) {
  return (
    <IconFrame {...props}>
      <path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8-4.3-4.1 5.9-.9z" />
    </IconFrame>
  );
}

export function BulletListIcon(props: NoteIconProps) {
  return (
    <IconFrame {...props}>
      <path d="M9 6h11M9 12h11M9 18h11" />
      <circle cx="4.5" cy="6" r="1" />
      <circle cx="4.5" cy="12" r="1" />
      <circle cx="4.5" cy="18" r="1" />
    </IconFrame>
  );
}

export function CardsIcon(props: NoteIconProps) {
  return (
    <IconFrame {...props}>
      <rect x="3" y="6" width="14" height="15" rx="2" />
      <path d="M7 3h12a2 2 0 0 1 2 2v13" />
    </IconFrame>
  );
}
