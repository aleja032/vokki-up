import type { ReactNode } from 'react';

// Stroke icons taken from the visual proposal (24x24 grid, 1.8 stroke).
const ICON_SHAPES = {
  plus: <path d="M12 5v14M5 12h14" />,
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-4-4" />
    </>
  ),
  folder: (
    <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
  ),
  stack: (
    <>
      <rect x="3" y="6" width="14" height="15" rx="2" />
      <path d="M7 3h12a2 2 0 0 1 2 2v13" />
    </>
  ),
  back: <path d="M15 6l-6 6 6 6" />,
  forward: <path d="M9 6l6 6-6 6" />,
  arrowRight: <path d="M5 12h14M13 6l6 6-6 6" />,
  check: <path d="M5 12.5l4.5 4.5L19 7" />,
  alertCircle: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v5M12 16h.01" />
    </>
  ),
  alertTriangle: (
    <>
      <path d="M12 3l9.5 17H2.5z" />
      <path d="M12 10v4M12 17h.01" />
    </>
  ),
  more: (
    <>
      <circle cx="12" cy="5" r="1" />
      <circle cx="12" cy="12" r="1" />
      <circle cx="12" cy="19" r="1" />
    </>
  )
} satisfies Record<string, ReactNode>;

export type DeckIconName = keyof typeof ICON_SHAPES;

type DeckIconProps = {
  name: DeckIconName;
  size?: number;
};

export function DeckIcon({ name, size = 20 }: DeckIconProps) {
  return (
    <svg
      className="deck-icon"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      {ICON_SHAPES[name]}
    </svg>
  );
}
