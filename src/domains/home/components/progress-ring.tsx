interface ProgressRingProps {
  ariaLabel: string;
  caption: string;
  completed: number;
  dashArray: string;
  variant: 'goal' | 'overview';
}

export function ProgressRing({
  ariaLabel,
  caption,
  completed,
  dashArray,
  variant
}: ProgressRingProps) {
  return (
    <div
      aria-label={ariaLabel}
      className={`progress-ring home-ring home-ring--${variant}`}
      role="img"
    >
      <svg
        aria-hidden="true"
        className="progress-ring__graphic"
        viewBox="0 0 80 80"
      >
        <circle className="progress-ring__track" cx="40" cy="40" r="34" />
        <circle
          className="progress-ring__value"
          cx="40"
          cy="40"
          r="34"
          strokeDasharray={dashArray}
        />
      </svg>
      <span className="progress-ring__label">
        <strong>{completed}</strong>
        <span>{caption}</span>
      </span>
    </div>
  );
}
