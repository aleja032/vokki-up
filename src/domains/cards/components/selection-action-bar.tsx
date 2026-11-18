import { X } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import './selection-action-bar.css';

type SelectionActionBarProps = {
  label: string;
  summary: string;
  toggleAllLabel: string;
  toggleAllDisabled?: boolean;
  cancelLabel: string;
  primaryLabel: string;
  primaryIcon?: ReactNode;
  primaryTone?: 'brand' | 'danger';
  primaryDisabled: boolean;
  onToggleAll: () => void;
  onCancel: () => void;
  onPrimary: () => void;
};

// Floats above the bottom navigation inside a zero-height sticky dock, so
// entering a selection mode never moves the content.
export function SelectionActionBar({
  label,
  summary,
  toggleAllLabel,
  toggleAllDisabled = false,
  cancelLabel,
  primaryLabel,
  primaryIcon,
  primaryTone = 'brand',
  primaryDisabled,
  onToggleAll,
  onCancel,
  onPrimary
}: SelectionActionBarProps) {
  return (
    <div className="selection-dock">
      <div className="selection-bar" role="group" aria-label={label}>
        <div className="selection-bar__summary">
          <span aria-live="polite">{summary}</span>
          <button
            className="selection-bar__toggle"
            disabled={toggleAllDisabled}
            onClick={onToggleAll}
            type="button"
          >
            {toggleAllLabel}
          </button>
        </div>
        <div className="selection-bar__actions">
          <button
            className="selection-bar__cancel"
            onClick={onCancel}
            type="button"
          >
            <X aria-hidden="true" size={18} />
            {cancelLabel}
          </button>
          <button
            className={cn(
              'selection-bar__primary',
              primaryTone === 'danger' && 'selection-bar__primary--danger'
            )}
            disabled={primaryDisabled}
            onClick={onPrimary}
            type="button"
          >
            {primaryIcon}
            {primaryLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
