import { cn } from '@/lib/utils';
import './segmented-toggle.css';

type SegmentedToggleOption<T extends string> = {
  value: T;
  label: string;
  /** Optional count shown after the label (filter variant). */
  count?: number;
  /** Optional colored dot in front of the label (filter variant). */
  dot?: 'coral' | 'brand' | 'mint';
};

type SegmentedToggleProps<T extends string> = {
  options: readonly SegmentedToggleOption<T>[];
  value: T;
  onChange: (value: T) => void;
  /** Id of the element that names the group (a visible label). */
  labelledBy?: string;
  /** Accessible name when there is no visible label. */
  ariaLabel?: string;
  /** `filter` is the compact status filter with dots and counts. */
  variant?: 'toggle' | 'filter';
  className?: string;
};

// Pill-shaped single choice control: a group of toggle buttons, exactly one
// pressed. Used for the app language (toggle) and the Mi mazo status filter
// (filter variant, with dots and counts).
export function SegmentedToggle<T extends string>({
  options,
  value,
  onChange,
  labelledBy,
  ariaLabel,
  variant = 'toggle',
  className
}: SegmentedToggleProps<T>) {
  return (
    <div
      aria-label={ariaLabel}
      aria-labelledby={labelledBy}
      className={cn(
        'segmented-toggle',
        variant === 'filter' && 'segmented-toggle--filter',
        className
      )}
      role="group"
    >
      {options.map(option => (
        <button
          aria-pressed={option.value === value}
          className="segmented-toggle__option"
          key={option.value}
          onClick={() => onChange(option.value)}
          type="button"
        >
          {option.dot ? (
            <span
              aria-hidden="true"
              className="segmented-toggle__dot"
              data-dot={option.dot}
            />
          ) : null}
          {option.label}
          {option.count !== undefined ? (
            <span className="segmented-toggle__count">{option.count}</span>
          ) : null}
        </button>
      ))}
    </div>
  );
}
