import { cn } from '@/lib/utils';
import './level-diamonds.css';

type LevelDiamondsProps = {
  /** Filled diamonds, from 0 to `max`. */
  level: number;
  max?: number;
  /** Accessible name, e.g. "Nivel 2 de 3". */
  label: string;
  className?: string;
};

// Difficulty marker of the proposal: a row of diamonds, the first `level`
// filled. The row is one image for assistive tech.
export function LevelDiamonds({
  level,
  max = 3,
  label,
  className
}: LevelDiamondsProps) {
  return (
    <span
      aria-label={label}
      className={cn('level-diamonds', className)}
      role="img"
    >
      {Array.from({ length: max }, (_, index) => (
        <span
          aria-hidden="true"
          className="level-diamonds__gem"
          data-filled={index < level}
          key={index}
        />
      ))}
    </span>
  );
}
