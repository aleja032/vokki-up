'use client';

import { useEffect, useRef, useState } from 'react';
import { APP_LANGUAGES, LEARNING_LEVELS, PROVIDER_OPTIONS } from '../data';
import { settingsMessages } from '../messages';
import { FEATURES } from '@/config/features';
import { useAuthSession } from '@/lib/auth/use-auth-session';
import {
  AI_USE_CARDS_STORAGE_KEY,
  isAiForCardsValue
} from '@/lib/settings/ai-for-cards.util';
import type { AiProvider, AppTheme, SettingsTab } from '../types';
import type { JsonValue } from '@/lib/sync/types';
import { THEME_STORAGE_KEY } from '@/lib/theme/theme-init-script';
import { useBrowserState } from '@/lib/storage/use-browser-state';
import { setAppLanguage, type AppLanguage } from '@/lib/i18n/locale';
import { languageToLocale, writeLocaleCookie } from '@/lib/i18n/locale-cookie';

export function useSettingsPreferences(initialTab: SettingsTab = 'profile') {
  const [activeTab, setActiveTab] = useState<SettingsTab>(initialTab);
  const [theme, setTheme, isThemeLoaded] = useTrackedSetting<AppTheme>(
    THEME_STORAGE_KEY,
    'system',
    isAppTheme
  );
  const [language, setLanguage, isLanguageLoaded] = useTrackedSetting(
    'settings/language',
    'Español',
    isAppLanguage
  );
  const [draftLanguage, setDraftLanguage] = useState<AppLanguage>('Español');
  const hasInitializedLanguageDraft = useRef(false);
  const [level, setLevel] = useTrackedSetting(
    'settings/level',
    'B1',
    isLearningLevel
  );
  const [dailyGoal, setDailyGoal] = useTrackedSetting(
    'settings/daily-goal',
    20,
    isDailyGoal
  );
  const [isReminderEnabled, setIsReminderEnabled] = useTrackedSetting(
    'settings/reminder-enabled',
    false,
    isBoolean
  );
  const [hasReminderConsent, setHasReminderConsent] = useTrackedSetting(
    'settings/reminder-consent',
    false,
    isBoolean
  );
  const [reminderDeliveryConfigured, setReminderDeliveryConfigured] =
    useState(false);
  const [reminderError, setReminderError] = useState('');
  const { session, isLoading: isAuthSessionLoading } = useAuthSession();
  const userId = session?.status === 'authenticated' ? session.user.id : null;
  const isAuthenticated = userId !== null;
  const reminderSetters = useRef({
    setIsReminderEnabled,
    setHasReminderConsent
  });
  useEffect(() => {
    reminderSetters.current = { setIsReminderEnabled, setHasReminderConsent };
  });
  const [provider, setProvider] = useTrackedSetting<AiProvider>(
    'settings/provider',
    'gemini',
    isAiProvider
  );
  const [model, setModel] = useTrackedSetting(
    'settings/model',
    PROVIDER_OPTIONS[0].models[0],
    isModel
  );
  const [shouldUseAiForCards, setShouldUseAiForCards] = useTrackedSetting(
    AI_USE_CARDS_STORAGE_KEY,
    true,
    isAiForCardsValue
  );
  const isLanguageDirty = isLanguageLoaded && draftLanguage !== language;
  const providerOptions =
    PROVIDER_OPTIONS.find(option => option.id === provider) ??
    PROVIDER_OPTIONS[0];

  useEffect(() => {
    if (!FEATURES.profileExtras) return;
    if (isAuthSessionLoading) return;
    if (!userId) return;

    let active = true;
    void fetch('/api/reminders/send?preferences=1', { cache: 'no-store' })
      .then(async response => {
        if (!response.ok)
          throw new Error('Reminder preferences are unavailable.');
        return (await response.json()) as {
          enabled: boolean;
          consent: boolean;
          deliveryConfigured: boolean;
        };
      })
      .then(preferences => {
        if (!active) return;
        reminderSetters.current.setIsReminderEnabled(preferences.enabled);
        reminderSetters.current.setHasReminderConsent(preferences.consent);
        setReminderDeliveryConfigured(preferences.deliveryConfigured);
        setReminderError('');
      })
      .catch(() => {
        if (!active) return;
        setReminderDeliveryConfigured(false);
        setReminderError(settingsMessages.profile.reminderSaveError);
      });

    return () => {
      active = false;
    };
  }, [isAuthSessionLoading, userId]);

  useEffect(() => {
    if (!isThemeLoaded) return;
    if (theme === 'system') delete document.documentElement.dataset.theme;
    else document.documentElement.dataset.theme = theme;
  }, [isThemeLoaded, theme]);

  useEffect(() => {
    if (!isLanguageLoaded || hasInitializedLanguageDraft.current) return;
    hasInitializedLanguageDraft.current = true;
    setDraftLanguage(language);
  }, [isLanguageLoaded, language]);

  function changeProvider(nextProvider: AiProvider) {
    setProvider(nextProvider);
    const nextOptions =
      PROVIDER_OPTIONS.find(option => option.id === nextProvider) ??
      PROVIDER_OPTIONS[0];
    setModel(nextOptions.models[0]);
  }

  // Theme, toggles and the other controls persist on change; the only draft
  // committed by Save is the app language.
  function saveChanges() {
    if (!isLanguageDirty) return;
    setLanguage(draftLanguage);
    writeLocaleCookie(languageToLocale(draftLanguage));
    setAppLanguage(draftLanguage);
  }

  async function saveReminderPreferences(enabled: boolean, consent: boolean) {
    const response = await fetch('/api/reminders/send', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ enabled, consent })
    });
    const result = (await response.json()) as {
      enabled?: boolean;
      consent?: boolean;
      deliveryConfigured?: boolean;
    };
    if (!response.ok || typeof result.enabled !== 'boolean') {
      throw new Error(settingsMessages.profile.reminderSaveError);
    }
    setIsReminderEnabled(result.enabled);
    setHasReminderConsent(result.consent === true);
    setReminderDeliveryConfigured(result.deliveryConfigured === true);
    setReminderError('');
  }

  function changeReminder(enabled: boolean) {
    if (!isAuthenticated) {
      setIsReminderEnabled(enabled);
      return;
    }
    if (enabled && !reminderDeliveryConfigured) {
      setReminderError(settingsMessages.profile.reminderSetupRequired);
      return;
    }
    const previous = isReminderEnabled;
    const previousConsent = hasReminderConsent;
    const nextConsent = enabled;
    setIsReminderEnabled(enabled);
    setHasReminderConsent(nextConsent);
    void saveReminderPreferences(enabled, nextConsent).catch(() => {
      setIsReminderEnabled(previous);
      setHasReminderConsent(previousConsent);
      setReminderError(settingsMessages.profile.reminderSaveError);
    });
  }

  return {
    activeTab,
    setActiveTab,
    theme,
    language: draftLanguage,
    level,
    dailyGoal,
    isReminderEnabled,
    hasReminderConsent,
    reminderDeliveryConfigured,
    reminderError,
    isAuthenticated,
    provider,
    model,
    shouldUseAiForCards,
    isSaved: !isLanguageDirty,
    isLanguageDirty,
    providerOptions,
    changeTheme: setTheme,
    changeLanguage: setDraftLanguage,
    changeLevel: setLevel,
    changeDailyGoal: setDailyGoal,
    changeReminder,
    changeModel: setModel,
    changeUseAiForCards: setShouldUseAiForCards,
    changeProvider,
    saveChanges
  };
}

function isAppTheme(value: unknown): value is AppTheme {
  return value === 'light' || value === 'dark' || value === 'system';
}
function isAppLanguage(
  value: unknown
): value is (typeof APP_LANGUAGES)[number] {
  return APP_LANGUAGES.includes(value as (typeof APP_LANGUAGES)[number]);
}
function isLearningLevel(
  value: unknown
): value is (typeof LEARNING_LEVELS)[number] {
  return LEARNING_LEVELS.includes(value as (typeof LEARNING_LEVELS)[number]);
}
function isAiProvider(value: unknown): value is AiProvider {
  return PROVIDER_OPTIONS.some(option => option.id === value);
}
function isBoundedNumber(
  value: unknown,
  min: number,
  max: number
): value is number {
  return (
    typeof value === 'number' &&
    Number.isFinite(value) &&
    value >= min &&
    value <= max
  );
}
function isDailyGoal(value: unknown): value is number {
  return isBoundedNumber(value, 1, 100);
}
function isBoolean(value: unknown): value is boolean {
  return typeof value === 'boolean';
}
function isModel(value: unknown): value is string {
  return PROVIDER_OPTIONS.some(option =>
    option.models.some(model => model === String(value))
  );
}
function useTrackedSetting<T extends JsonValue>(
  key: string,
  fallback: T,
  isValid: (value: unknown) => value is T
) {
  // Settings are local-only: the sync route and drain only handle cards, so
  // no sync operations are enqueued for them.
  return useBrowserState(key, fallback, isValid);
}
