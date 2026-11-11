import type { ReactNode } from 'react';

// Stroke icons taken from the visual proposal (24x24 grid, 1.8 stroke).
const ICON_SHAPES = {
  back: <path d="M15 6l-6 6 6 6" />,
  arrowRight: <path d="M5 12h14M13 6l6 6-6 6" />,
  check: <path d="M5 12.5l4.5 4.5L19 7" />,
  close: <path d="M6 6l12 12M18 6 6 18" />,
  plus: <path d="M12 5v14M5 12h14" />,
  retry: (
    <>
      <path d="M20 12a8 8 0 1 1-2.3-5.6" />
      <path d="M20 4v5h-5" />
    </>
  ),
  trash: <path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13" />,
  info: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5M12 8h.01" />
    </>
  ),
  warning: (
    <>
      <path d="M12 3l9.5 17H2.5z" />
      <path d="M12 10v4M12 17h.01" />
    </>
  ),
  image: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <circle cx="9" cy="10" r="2" />
      <path d="M21 16l-5-5-9 9" />
    </>
  ),
  camera: (
    <>
      <path d="M4 8h3l2-3h6l2 3h3v11H4z" />
      <circle cx="12" cy="13" r="3.5" />
    </>
  ),
  upload: (
    <>
      <path d="M12 16V4M7 9l5-5 5 5" />
      <path d="M4 16v4h16v-4" />
    </>
  ),
  device: (
    <>
      <rect x="6" y="3" width="12" height="18" rx="2" />
      <path d="M11 18h2" />
    </>
  ),
  wifiOff: (
    <>
      <path d="M5 12.5a10 10 0 0 1 14 0" />
      <path d="M8.5 16a5 5 0 0 1 7 0" />
      <path d="M2 9a15 15 0 0 1 20 0" />
      <path d="M12 20h.01" />
      <path d="M3 3l18 18" />
    </>
  )
} satisfies Record<string, ReactNode>;

export type AiCaptureIconName = keyof typeof ICON_SHAPES;

type AiCaptureIconProps = {
  name: AiCaptureIconName;
  size?: number;
};

export function AiCaptureIcon({ name, size = 20 }: AiCaptureIconProps) {
  return (
    <svg
      className="aicap-icon"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      {ICON_SHAPES[name]}
    </svg>
  );
}
