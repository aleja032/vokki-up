import type { ReactNode } from 'react';

// Stroke icons taken from the visual proposal (24x24 grid, 1.8 stroke).
const ICON_SHAPES = {
  close: <path d="M6 6l12 12M18 6 6 18" />,
  check: <path d="M5 12.5l4.5 4.5L19 7" />,
  eye: (
    <>
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  speaker: (
    <>
      <path d="M4 9v6h4l5 4V5L8 9H4z" />
      <path d="M16.5 8.5a5 5 0 0 1 0 7" />
    </>
  ),
  device: (
    <>
      <rect x="6" y="3" width="12" height="18" rx="2" />
      <path d="M11 18h2" />
    </>
  )
} satisfies Record<string, ReactNode>;

type ReviewIconName = keyof typeof ICON_SHAPES;

type ReviewIconProps = {
  name: ReviewIconName;
  size: number;
};

export function ReviewIcon({ name, size }: ReviewIconProps) {
  return (
    <svg
      className="drill-icon"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      {ICON_SHAPES[name]}
    </svg>
  );
}
