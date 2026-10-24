'use client';

import Link from 'next/link';
import { PROVIDER_OPTIONS } from '../data';
import { useSettingsPreferences } from '../hooks/use-settings-preferences';
import { settingsMessages } from '../messages';
import type { ConnectionStatus, ConnectionTest, SettingsTab } from '../types';
import { AiProviderPanel } from './ai-provider-panel';
import { ProfilePanel } from './profile-panel';
import { SettingsIcon } from './settings-icon';
import './settings.css';

const TABS: SettingsTab[] = ['profile', 'provider'];

interface SettingsWorkspaceProps {
  /** Static preview of the connection banner (no real status is computed yet). */
  connectionStatus?: ConnectionStatus;
  /** Static preview of the connection test result (no real test runs yet). */
  connectionTest?: ConnectionTest;
  initialTab?: SettingsTab;
}

export function SettingsWorkspace({
  connectionStatus = 'unconfigured',
  connectionTest = 'idle',
  initialTab = 'profile'
}: SettingsWorkspaceProps) {
  const preferences = useSettingsPreferences(initialTab);
  const { activeTab } = preferences;

  return (
    <div className="prefs">
      <header className="prefs__header">
        <div className="prefs__heading">
          <Link
            aria-label={settingsMessages.backLabel}
            className="prefs__back"
            href="/"
          >
            <SettingsIcon name="back" />
          </Link>
          <h1 className="prefs__title">{settingsMessages.title}</h1>
        </div>
        <div
          aria-label={settingsMessages.tabsLabel}
          className="prefs-tabs"
          role="tablist"
        >
          {TABS.map(tab => (
            <button
              aria-controls={`settings-${tab}`}
              aria-selected={activeTab === tab}
              className="prefs-tab"
              data-tab={tab}
              id={`settings-tab-${tab}`}
              key={tab}
              onClick={() => preferences.setActiveTab(tab)}
              role="tab"
              type="button"
            >
              {settingsMessages.tabs[tab]}
            </button>
          ))}
        </div>
      </header>

      <ProfilePanel
        dailyGoal={preferences.dailyGoal}
        displayName={preferences.displayName}
        isActive={activeTab === 'profile'}
        isReminderEnabled={preferences.isReminderEnabled}
        hasReminderConsent={preferences.hasReminderConsent}
        isAuthenticated={preferences.isAuthenticated}
        reminderDeliveryConfigured={preferences.reminderDeliveryConfigured}
        reminderError={preferences.reminderError}
        isSaved={preferences.isSaved}
        language={preferences.language}
        level={preferences.level}
        onDailyGoalChange={preferences.changeDailyGoal}
        onDisplayNameChange={preferences.changeDisplayName}
        onLanguageChange={preferences.changeLanguage}
        onLevelChange={preferences.changeLevel}
        onReminderChange={preferences.changeReminder}
        onReminderConsentChange={preferences.changeReminderConsent}
        onSave={preferences.saveChanges}
        onThemeChange={preferences.changeTheme}
        theme={preferences.theme}
      />

      <AiProviderPanel
        connectionStatus={connectionStatus}
        connectionTest={connectionTest}
        isActive={activeTab === 'provider'}
        isSaved={preferences.isSaved}
        model={preferences.model}
        models={
          (
            PROVIDER_OPTIONS.find(
              option => option.id === preferences.provider
            ) ?? PROVIDER_OPTIONS[0]
          ).models
        }
        onModelChange={preferences.changeModel}
        onProviderChange={preferences.changeProvider}
        onSave={preferences.saveChanges}
        onUseForCardsChange={preferences.changeUseAiForCards}
        onUseForWritingChange={preferences.changeUseAiForWriting}
        provider={preferences.provider}
        shouldUseForCards={preferences.shouldUseAiForCards}
        shouldUseForWriting={preferences.shouldUseAiForWriting}
      />
    </div>
  );
}
