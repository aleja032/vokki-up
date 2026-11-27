import { cn } from '@/lib/utils';
import { cardsMessages } from '../messages';
import {
  MAX_ROUND_SIZE,
  ROUND_SIZES,
  type RoundSize
} from '../review-round-size';
import './round-size-control.css';

const messages = cardsMessages.overview;

type RoundSizeControlProps = {
  size: RoundSize;
  onChange: (size: RoundSize) => void;
  className?: string;
};

// "Ronda de: 10 · 20 · Todas": how many cards one review round holds. A small
// radio group next to the review button; "Todas" is every due card up to the
// hard cap.
export function RoundSizeControl({
  size,
  onChange,
  className
}: RoundSizeControlProps) {
  return (
    <div className={cn('round-size', className)}>
      <span aria-hidden="true" className="round-size__label">
        {messages.roundSizeLabel}
      </span>
      <div
        aria-label={messages.roundSizeGroupLabel}
        className="round-size__options"
        role="radiogroup"
      >
        {ROUND_SIZES.map(option => (
          <button
            aria-checked={option === size}
            className={cn(
              'round-size__option',
              option === size && 'round-size__option--on'
            )}
            key={option}
            onClick={() => onChange(option)}
            role="radio"
            type="button"
          >
            {option === MAX_ROUND_SIZE ? messages.roundSizeAll : option}
          </button>
        ))}
      </div>
    </div>
  );
}
