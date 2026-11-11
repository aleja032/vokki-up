interface SettingsStepperProps {
  decreaseLabel: string;
  increaseLabel: string;
  max: number;
  min: number;
  onChange: (value: number) => void;
  value: number;
}

export function SettingsStepper({
  decreaseLabel,
  increaseLabel,
  max,
  min,
  onChange,
  value
}: SettingsStepperProps) {
  return (
    <div className="prefs-stepper">
      <button
        aria-label={decreaseLabel}
        className="prefs-stepper__button"
        disabled={value <= min}
        onClick={() => onChange(Math.max(min, value - 1))}
        type="button"
      >
        −
      </button>
      <span aria-live="polite" className="prefs-stepper__value">
        {value}
      </span>
      <button
        aria-label={increaseLabel}
        className="prefs-stepper__button"
        disabled={value >= max}
        onClick={() => onChange(Math.min(max, value + 1))}
        type="button"
      >
        +
      </button>
    </div>
  );
}
