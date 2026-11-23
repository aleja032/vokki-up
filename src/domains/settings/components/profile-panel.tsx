import { useId } from 'react';
import { ActionPill } from '@/components/ui/action-pill';
import { Chip } from '@/components/ui/chip';
import { SegmentedToggle } from '@/components/ui/segmented-toggle';
import { APP_LANGUAGES, LEARNING_LEVELS } from '../data';
import { settingsMessages } from '../messages';
import { FEATURES } from '@/config/features';
import { getAvatarInitial } from '@/lib/auth/avatar-initial.util';
import { useAuthSession } from '@/lib/auth/use-auth-session';
import { getVisibleProfileSections } from '../profile-visibility.util';
import type { AppTheme } from '../types';
import { SettingsIcon } from './settings-icon';
import { SettingsSaveState } from './settings-save-state';
import { SettingsStepper } from './settings-stepper';
import { SettingsSwitch } from './settings-switch';
import { SettingsThemePicker } from './settings-theme-picker';

type AppLanguage = (typeof APP_LANGUAGES)[number];
type LearningLevel = (typeof LEARNING_LEVELS)[number];

const LANGUAGE_OPTIONS = APP_LANGUAGES.map(value => ({
  value,
  label: value
}));

interface ProfilePanelProps {
  dailyGoal: number;
  isActive: boolean;
  isReminderEnabled: boolean;
  isAuthenticated: boolean;
  reminderDeliveryConfigured: boolean;
  reminderError: string;
  isSaved: boolean;
  language: AppLanguage;
  level: LearningLevel;
  onDailyGoalChange: (value: number) => void;
  onLanguageChange: (value: AppLanguage) => void;
  onLevelChange: (value: LearningLevel) => void;
  onReminderChange: (value: boolean) => void;
  onSave: () => void;
  onThemeChange: (value: AppTheme) => void;
  theme: AppTheme;
}

export function ProfilePanel(props: ProfilePanelProps) {
  const copy = settingsMessages.profile;
  const ids = useId();
  const languageLabelId = `${ids}-language`;
  const levelLabelId = `${ids}-level`;
  const themeLabelId = `${ids}-theme`;
  const { session, isLoading } = useAuthSession();
  const isAuthenticated = session?.status === 'authenticated';
  const visible = getVisibleProfileSections(
    isLoading ? 'loading' : isAuthenticated ? 'authenticated' : 'guest',
    FEATURES
  );
  const identityName = isAuthenticated
    ? session.user.displayName || session.user.email
    : '';
  const initial = getAvatarInitial({
    displayName: isAuthenticated ? session.user.displayName : undefined,
    email: isAuthenticated ? session.user.email : undefined
  });

  return (
    <section
      aria-labelledby="settings-tab-profile"
      className="prefs-panel"
      hidden={!props.isActive}
      id="settings-profile"
      role="tabpanel"
    >
      <div className="prefs-card prefs-card--profile">
        <h2 className="prefs-card__heading">{settingsMessages.tabs.profile}</h2>

        {visible.account && isAuthenticated ? (
          <div className="prefs-account">
            <div className="prefs-account__identity">
              <span aria-hidden="true" className="prefs-avatar">
                {initial}
              </span>
              <span className="prefs-account__copy">
                <span
                  className="prefs-account__name"
                  title={identityName || copy.fallbackName}
                >
                  {identityName || copy.fallbackName}
                </span>
                <span className="prefs-account__note">
                  {session.user.email}
                </span>
              </span>
            </div>
          </div>
        ) : null}

        <div className="prefs-field">
          <span className="prefs-label" id={languageLabelId}>
            {copy.languageLabel}
          </span>
          <SegmentedToggle
            labelledBy={languageLabelId}
            onChange={props.onLanguageChange}
            options={LANGUAGE_OPTIONS}
            value={props.language}
          />
        </div>

        {visible.level ? (
          <div className="prefs-field">
            <span className="prefs-label" id={levelLabelId}>
              {copy.levelLabel}
            </span>
            <div
              aria-labelledby={levelLabelId}
              className="prefs-levels"
              role="group"
            >
              {LEARNING_LEVELS.map(value => (
                <Chip
                  key={value}
                  onClick={() => props.onLevelChange(value)}
                  pressed={props.level === value}
                >
                  {value}
                </Chip>
              ))}
            </div>
          </div>
        ) : null}

        {visible.dailyGoal || visible.reminder ? (
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
                  {props.isAuthenticated
                    ? !props.reminderDeliveryConfigured
                      ? copy.reminderSetupRequired
                      : props.isReminderEnabled
                        ? copy.reminderOn
                        : copy.reminderOff
                    : props.isReminderEnabled
                      ? copy.reminderLocalOn
                      : copy.reminderLocalOff}
                </span>
              </span>
              <SettingsSwitch
                isChecked={props.isReminderEnabled}
                label={copy.reminderTitle}
                onChange={props.onReminderChange}
              />
            </div>
            {props.reminderError ? (
              <p className="prefs-hint" role="status">
                {props.reminderError}
              </p>
            ) : null}
          </div>
        ) : null}

        <div className="prefs-field">
          <span className="prefs-label" id={themeLabelId}>
            {copy.themeLabel}
          </span>
          <SettingsThemePicker
            labelledBy={themeLabelId}
            onChange={props.onThemeChange}
            theme={props.theme}
          />
        </div>

        <footer className="prefs-footer">
          <SettingsSaveState isSaved={props.isSaved} />
          <ActionPill
            disabled={props.isSaved}
            onClick={props.onSave}
            variant="primary"
          >
            {copy.save}
          </ActionPill>
        </footer>
      </div>

      {visible.data ? (
        <aside className="prefs-aside">
          <section aria-labelledby="settings-data-title" className="prefs-data">
            <h2 className="prefs-data__title" id="settings-data-title">
              {copy.dataTitle}
            </h2>
            <p className="prefs-data__summary">{copy.dataSummary}</p>
            <ActionPill
              href="/import-export"
              icon={<SettingsIcon name="download" size={18} />}
            >
              <span className="prefs-narrow-only">{copy.exportNarrow}</span>
              <span className="prefs-wide-only">{copy.exportWide}</span>
            </ActionPill>
          </section>
        </aside>
      ) : null}
    </section>
  );
}
