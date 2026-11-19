import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import './search-field.css';

type SearchFieldProps = {
  id: string;
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
};

export function SearchField({
  id,
  label,
  placeholder,
  value,
  onChange,
  className
}: SearchFieldProps) {
  return (
    <div className={cn('search-field', className)}>
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
