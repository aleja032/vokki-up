import type { ReactNode } from 'react';

type WritingIconProps = {
  size: number;
};

function IconFrame({
  size,
  children
}: WritingIconProps & { children: ReactNode }) {
  return (
    <svg
      className="essay-icon"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

export function RefreshIcon({ size }: WritingIconProps) {
  return (
    <IconFrame size={size}>
      <path d="M20 12a8 8 0 1 1-2.3-5.6" />
      <path d="M20 4v5h-5" />
    </IconFrame>
  );
}

export function ArrowRightIcon({ size }: WritingIconProps) {
  return (
    <IconFrame size={size}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </IconFrame>
  );
}

export function PlusIcon({ size }: WritingIconProps) {
  return (
    <IconFrame size={size}>
      <path d="M12 5v14M5 12h14" />
    </IconFrame>
  );
}
