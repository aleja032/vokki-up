import Link from 'next/link';
import { cn } from '@/lib/utils';
import './segmented-toggle.css';

type SegmentedToggleOption<T extends string> = {
  value: T;
  label: string;
  /** Shorter label for phones; the long one shows from 761px (filter variant). */
  shortLabel?: string;
  /** Optional count shown after the label (filter variant). */
  count?: number;
  /** Optional colored dot in front of the label (filter variant). */
  dot?: 'coral' | 'brand' | 'mint';
  /** Makes the option a link (page tabs) instead of a toggle button. */
  href?: string;
};

type SegmentedToggleProps<T extends string> = {
  options: readonly SegmentedToggleOption<T>[];
  value: T;
  /** Required for toggle buttons; link options navigate instead. */
  onChange?: (value: T) => void;
  /** Id of the element that names the group (a visible label). */
  labelledBy?: string;
  /** Accessible name when there is no visible label. */
  ariaLabel?: string;
  /** `filter` is the compact status filter with dots and counts. */
  variant?: 'toggle' | 'filter';
  className?: string;
};

// Pill-shaped single choice control: a group of toggle buttons, exactly one
// pressed. Used for the app language (toggle), the Mi mazo status filter
// (filter variant, with dots and counts) and the Mundos page tabs (options
// with an `href` render links, the current one marked `aria-current`).
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
      {options.map(option => {
        const content = (
          <>
            {option.dot ? (
              <span
                aria-hidden="true"
                className="segmented-toggle__dot"
                data-dot={option.dot}
              />
            ) : null}
            {option.shortLabel ? (
              <>
                <span className="segmented-toggle__long">{option.label}</span>
                <span className="segmented-toggle__short">
                  {option.shortLabel}
                </span>
              </>
            ) : (
              option.label
            )}
            {option.count !== undefined ? (
              <span className="segmented-toggle__count">{option.count}</span>
            ) : null}
          </>
        );
        if (option.href) {
          return (
            <Link
              aria-current={option.value === value ? 'page' : undefined}
              className="segmented-toggle__option"
              href={option.href}
              key={option.value}
            >
              {content}
            </Link>
          );
        }
        return (
          <button
            aria-pressed={option.value === value}
            className="segmented-toggle__option"
            key={option.value}
            onClick={() => onChange?.(option.value)}
            type="button"
          >
            {content}
          </button>
        );
      })}
    </div>
  );
}
