import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import './pixel-label.css';

type PixelLabelProps = {
  children: ReactNode;
  className?: string;
};

// Uppercase micro label set in the pixel font.
export function PixelLabel({ children, className }: PixelLabelProps) {
  return <span className={cn('pixel-label', className)}>{children}</span>;
}
