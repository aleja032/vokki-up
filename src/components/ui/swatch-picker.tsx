import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import './swatch-picker.css';

export type SwatchOption = {
  value: string;
  /** Visible name of the color (also its accessible name). */
  label: string;
  /** Folder color key read by `data-folder-color` in globals.css. */
  color: string;
};

type SwatchPickerProps = {
  legend: string;
  /** Shared by the radios: one group, arrow keys move the selection. */
  name: string;
  options: readonly SwatchOption[];
  value: string;
  onChange: (value: string) => void;
  /** Marks the selected radio so a dialog can focus it when it opens. */
  autoFocusSelected?: boolean;
  className?: string;
};

// A closed set of color swatches as a native radio group: a legend, one named
// radio per color, a ring and a check on the selected one. Colors come from the
// `--folder-*` tokens through `data-folder-color`, never from raw values.
export function SwatchPicker({
  legend,
  name,
  options,
  value,
  onChange,
  autoFocusSelected = false,
  className
}: SwatchPickerProps) {
  return (
    <fieldset className={cn('swatch-picker', className)}>
      <legend className="swatch-picker__legend">{legend}</legend>
      <div className="swatch-picker__options">
        {options.map(option => {
          const isSelected = option.value === value;
          return (
            <label
              className="swatch-picker__option"
              data-folder-color={option.color}
              key={option.value}
            >
              <input
                checked={isSelected}
                className="swatch-picker__input"
                data-autofocus={
                  autoFocusSelected && isSelected ? '' : undefined
                }
                name={name}
                onChange={() => onChange(option.value)}
                type="radio"
                value={option.value}
              />
              <span aria-hidden="true" className="swatch-picker__dot">
                {isSelected ? <Check size={14} strokeWidth={3.2} /> : null}
              </span>
              <span className="swatch-picker__name">{option.label}</span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
