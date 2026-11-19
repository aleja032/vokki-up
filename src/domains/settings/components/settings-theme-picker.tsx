import { settingsMessages } from '../messages';
import type { AppTheme } from '../types';
import { SettingsIcon } from './settings-icon';

const THEME_OPTIONS: AppTheme[] = ['light', 'dark', 'system'];

interface SettingsThemePickerProps {
  labelledBy: string;
  onChange: (value: AppTheme) => void;
  theme: AppTheme;
}

// Three preview cards: the swatch shows the real light and dark grounds.
export function SettingsThemePicker({
  labelledBy,
  onChange,
  theme
}: SettingsThemePickerProps) {
  return (
    <div aria-labelledby={labelledBy} className="prefs-themes" role="group">
      {THEME_OPTIONS.map(value => (
        <button
          aria-pressed={theme === value}
          className="prefs-theme"
          key={value}
          onClick={() => onChange(value)}
          type="button"
        >
          <span
            aria-hidden="true"
            className="prefs-theme__swatch"
            data-preview={value}
          >
            {theme === value ? (
              <span className="prefs-theme__check">
                <SettingsIcon name="check" size={14} strokeWidth={3} />
              </span>
            ) : null}
          </span>
          <span className="prefs-theme__label">
            {settingsMessages.themes[value]}
          </span>
        </button>
      ))}
    </div>
  );
}
