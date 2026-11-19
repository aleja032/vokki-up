import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import './search-field.css';

type SearchFieldProps = {
  id: string;
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  /** `soft` swaps the pill for a 16px radius (Mi mazo toolbar). */
  shape?: 'pill' | 'soft';
  className?: string;
};

export function SearchField({
  id,
  label,
  placeholder,
  value,
  onChange,
  shape = 'pill',
  className
}: SearchFieldProps) {
  return (
    <div
      className={cn(
        'search-field',
        shape === 'soft' && 'search-field--soft',
        className
      )}
    >
      <label className="sr-only" htmlFor={id}>
        {label}
      </label>
      <Search aria-hidden="true" className="search-field__icon" size={20} />
      <input
        className="search-field__input"
        id={id}
        onChange={event => onChange(event.target.value)}
        placeholder={placeholder}
        type="search"
        value={value}
      />
    </div>
  );
}
