import { ChevronDown } from 'lucide-react';
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
  className?: string;
};

// Compact native select with its caption inside the control ("Tipo  Todos").
export function SelectField({
  id,
  label,
  options,
  value,
  onChange,
  className
}: SelectFieldProps) {
  return (
    <label className={cn('select-field', className)} htmlFor={id}>
      <span className="select-field__label">{label}</span>
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
