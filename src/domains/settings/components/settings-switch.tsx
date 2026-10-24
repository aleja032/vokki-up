interface SettingsSwitchProps {
  isChecked: boolean;
  label: string;
  onChange: (isChecked: boolean) => void;
}

export function SettingsSwitch({
  isChecked,
  label,
  onChange
}: SettingsSwitchProps) {
  return (
    <span className="prefs-switch">
      <input
        aria-label={label}
        checked={isChecked}
        className="prefs-switch__input"
        onChange={event => onChange(event.target.checked)}
        role="switch"
        type="checkbox"
      />
      <span aria-hidden="true" className="prefs-switch__track">
        <span className="prefs-switch__knob" />
      </span>
    </span>
  );
}
