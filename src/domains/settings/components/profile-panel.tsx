import Link from 'next/link';
import { APP_LANGUAGES, LEARNING_LEVELS } from '../data';
import { settingsMessages } from '../messages';
import type { AppTheme } from '../types';
import { SettingsIcon } from './settings-icon';
import { SettingsSaveState } from './settings-save-state';
import { SettingsStepper } from './settings-stepper';
import { SettingsSwitch } from './settings-switch';

const THEME_OPTIONS: AppTheme[] = ['light', 'dark', 'system'];

type AppLanguage = (typeof APP_LANGUAGES)[number];
type LearningLevel = (typeof LEARNING_LEVELS)[number];

interface ProfilePanelProps {
  dailyGoal: number;
  displayName: string;
  isActive: boolean;
  isReminderEnabled: boolean;
  isSaved: boolean;
  language: AppLanguage;
  level: LearningLevel;
  onDailyGoalChange: (value: number) => void;
  onDisplayNameChange: (value: string) => void;
  onLanguageChange: (value: AppLanguage) => void;
  onLevelChange: (value: LearningLevel) => void;
  onReminderChange: (value: boolean) => void;
  onSave: () => void;
  onThemeChange: (value: AppTheme) => void;
  theme: AppTheme;
}

export function ProfilePanel(props: ProfilePanelProps) {
  const copy = settingsMessages.profile;
  const initial =
    props.displayName.charAt(0).toLocaleUpperCase() ||
    copy.fallbackName.charAt(0);

  return (
    <section
      aria-labelledby="settings-tab-profile"
      className="prefs-panel"
      hidden={!props.isActive}
      id="settings-profile"
      role="tabpanel"
    >
      <div className="prefs-card">
        <div className="prefs-account">
          <div className="prefs-account__identity">
            <span aria-hidden="true" className="prefs-avatar">
              {initial}
            </span>
            <span className="prefs-account__copy">
              <span className="prefs-account__name">
                {props.displayName || copy.fallbackName}
              </span>
              <span className="prefs-account__note">{copy.noAccount}</span>
            </span>
          </div>
          <Link
            className="prefs-button prefs-button--outline prefs-account__action"
            href="/login"
          >
            {copy.signIn}
          </Link>
        </div>

        <div className="prefs-fields">
          <div className="prefs-field">
            <label className="prefs-label" htmlFor="settings-display-name">
              {copy.nameLabel}
            </label>
            <input
              className="prefs-input"
              id="settings-display-name"
              onChange={event => props.onDisplayNameChange(event.target.value)}
              type="text"
              value={props.displayName}
            />
          </div>
          <div className="prefs-field">
            <label className="prefs-label" htmlFor="settings-language">
              {copy.languageLabel}
            </label>
            <select
              className="prefs-input prefs-input--select"
              id="settings-language"
              onChange={event =>
                props.onLanguageChange(event.target.value as AppLanguage)
              }
              value={props.language}
            >
              {APP_LANGUAGES.map(value => (
                <option key={value}>{value}</option>
              ))}
            </select>
          </div>
        </div>

        <fieldset className="prefs-group">
          <legend className="prefs-legend">{copy.levelLabel}</legend>
          <div className="prefs-levels">
            {LEARNING_LEVELS.map(value => (
              <button
                aria-pressed={props.level === value}
                className="prefs-level"
                key={value}
                onClick={() => props.onLevelChange(value)}
                type="button"
              >
                {value}
              </button>
            ))}
          </div>
        </fieldset>

        <div className="prefs-rows">
          <div className="prefs-row">
            <span className="prefs-row__copy">
              <span className="prefs-row__title">{copy.dailyGoalTitle}</span>
              <span className="prefs-hint">{copy.dailyGoalHint}</span>
            </span>
            <SettingsStepper
              decreaseLabel={copy.decreaseGoal}
              increaseLabel={copy.increaseGoal}
              max={100}
              min={1}
              onChange={props.onDailyGoalChange}
              value={props.dailyGoal}
            />
          </div>
          <div className="prefs-row">
            <span className="prefs-row__copy">
              <span className="prefs-row__title">{copy.reminderTitle}</span>
              <span className="prefs-hint">
                {props.isReminderEnabled ? copy.reminderOn : copy.reminderOff}
              </span>
            </span>
            <SettingsSwitch
              isChecked={props.isReminderEnabled}
              label={copy.reminderTitle}
              onChange={props.onReminderChange}
            />
          </div>
        </div>

        <fieldset className="prefs-group">
          <legend className="prefs-legend">{copy.themeLabel}</legend>
          <div className="prefs-themes">
            {THEME_OPTIONS.map(value => (
              <button
                aria-pressed={props.theme === value}
                className="prefs-theme"
                key={value}
                onClick={() => props.onThemeChange(value)}
                type="button"
              >
                {settingsMessages.themes[value]}
              </button>
            ))}
          </div>
        </fieldset>

        <footer className="prefs-footer prefs-footer--profile">
          <div className="prefs-footer__actions">
            <SettingsSaveState isSaved={props.isSaved} />
            <button
              className="prefs-button prefs-button--primary"
              onClick={props.onSave}
              type="button"
            >
              {copy.save}
            </button>
          </div>
        </footer>
      </div>

      <aside className="prefs-aside">
        <section aria-labelledby="settings-data-title" className="prefs-data">
          <h2 className="prefs-data__title" id="settings-data-title">
            {copy.dataTitle}
          </h2>
          <p className="prefs-data__summary">{copy.dataSummary}</p>
          <Link className="prefs-action" href="/import-export">
            <span>
              <span className="prefs-narrow-only">{copy.exportNarrow}</span>
              <span className="prefs-wide-only">{copy.exportWide}</span>
            </span>
            <SettingsIcon name="download" size={18} />
          </Link>
          <button
            className="prefs-action prefs-action--danger"
            disabled
            type="button"
          >
            {copy.deleteAll}
            <SettingsIcon name="trash" size={18} />
          </button>
        </section>
      </aside>
    </section>
  );
}
