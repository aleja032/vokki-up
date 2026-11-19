import { cn } from '@/lib/utils';
import './segmented-toggle.css';

type SegmentedToggleOption<T extends string> = {
  value: T;
  label: string;
};

type SegmentedToggleProps<T extends string> = {
  options: readonly SegmentedToggleOption<T>[];
  value: T;
  onChange: (value: T) => void;
  /** Id of the element that names the group (a visible label). */
  labelledBy: string;
  className?: string;
};

// Pill-shaped single choice control: a group of toggle buttons, exactly one
// pressed. Used for the app language.
export function SegmentedToggle<T extends string>({
  options,
  value,
  onChange,
  labelledBy,
  className
}: SegmentedToggleProps<T>) {
  return (
    <div
      aria-labelledby={labelledBy}
      className={cn('segmented-toggle', className)}
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
          {option.label}
        </button>
      ))}
    </div>
  );
}
