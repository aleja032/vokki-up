import type { ReactNode } from 'react';

interface ShellIconProps {
  size?: number;
}

interface IconFrameProps extends ShellIconProps {
  children: ReactNode;
}

/* Inline icons copied from the visual proposal (24px grid, 1.8 stroke). */
function IconFrame({ size = 20, children }: IconFrameProps) {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height={size}
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.8}
      viewBox="0 0 24 24"
      width={size}
    >
      {children}
    </svg>
  );
}

export function HomeIcon({ size }: ShellIconProps) {
  return (
    <IconFrame size={size}>
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5 9.5V20h14V9.5" />
      <path d="M10 20v-6h4v6" />
    </IconFrame>
  );
}

export function CardsIcon({ size }: ShellIconProps) {
  return (
    <IconFrame size={size}>
      <rect height="15" rx="2" width="14" x="3" y="6" />
      <path d="M7 3h12a2 2 0 0 1 2 2v13" />
    </IconFrame>
  );
}

export function WritingIcon({ size }: ShellIconProps) {
  return (
    <IconFrame size={size}>
      <path d="M4 20h4L19 9l-4-4L4 16v4z" />
      <path d="M13.5 6.5l4 4" />
    </IconFrame>
  );
}

export function NotesIcon({ size }: ShellIconProps) {
  return (
    <IconFrame size={size}>
      <path d="M6 3h9l4 4v14H6z" />
      <path d="M14 3v5h5" />
      <path d="M9 13h7M9 17h5" />
    </IconFrame>
  );
}

export function SettingsIcon({ size }: ShellIconProps) {
  return (
    <IconFrame size={size}>
      <path d="M4 6h9M17 6h3M4 12h3M11 12h9M4 18h11M19 18h1" />
      <circle cx="15" cy="6" r="2" />
      <circle cx="9" cy="12" r="2" />
      <circle cx="17" cy="18" r="2" />
    </IconFrame>
  );
}

export function SidebarToggleIcon({ size }: ShellIconProps) {
  return (
    <IconFrame size={size}>
      <rect height="16" rx="2" width="18" x="3" y="4" />
      <path d="M9 4v16" />
    </IconFrame>
  );
}

export function CheckIcon({ size }: ShellIconProps) {
  return (
    <IconFrame size={size}>
      <path d="M5 12.5l4.5 4.5L19 7" />
    </IconFrame>
  );
}

export function PhoneIcon({ size }: ShellIconProps) {
  return (
    <IconFrame size={size}>
      <rect height="18" rx="2" width="12" x="6" y="3" />
      <path d="M11 18h2" />
    </IconFrame>
  );
}

export const navigationIcons = {
  home: HomeIcon,
  cards: CardsIcon,
  writing: WritingIcon,
  notes: NotesIcon
} as const;
