import { ChevronDown } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import './select-field.css';

type SelectFieldOption = {
  value: string;
  label: string;
};

type SelectFieldProps = {
  id: string;
  /** Visible caption in front of the value, also the accessible name. */
  label: string;
  options: readonly SelectFieldOption[];
  value: string;
  onChange: (value: string) => void;
  /** A non-default option is chosen (a highlighted state on phones). */
  isActive?: boolean;
  /**
   * Compact face for phones: the icon, and the chosen option next to it while
   * active. The native select stays on top, transparent, so the browser still
   * provides the menu. Wide screens keep the caption and the value.
   */
  icon?: ReactNode;
  className?: string;
};

// Compact native select with its caption inside the control ("Tipo  Todos").
export function SelectField({
  id,
  label,
  options,
  value,
  onChange,
  isActive,
  icon,
  className
}: SelectFieldProps) {
  const current = options.find(option => option.value === value);

  return (
    <label
      className={cn('select-field', className)}
      data-active={isActive || undefined}
      htmlFor={id}
    >
      <span className="select-field__label">{label}</span>
      {icon ? (
        <span aria-hidden="true" className="select-field__face">
          {icon}
          <span className="select-field__current">{current?.label}</span>
        </span>
      ) : null}
      <select
        className="select-field__control"
        id={id}
        onChange={event => onChange(event.target.value)}
        value={value}
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown
        aria-hidden="true"
        className="select-field__icon"
        size={18}
      />
    </label>
  );
}
