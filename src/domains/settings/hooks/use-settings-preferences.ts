'use client';

import { useEffect, useRef, useState, type SetStateAction } from 'react';
import { APP_LANGUAGES, LEARNING_LEVELS, PROVIDER_OPTIONS } from '../data';
import { settingsMessages } from '../messages';
import { useAuthSession } from '@/domains/auth/use-auth-session';
import type { AiProvider, AppTheme, SettingsTab } from '../types';
import type { JsonValue } from '@/lib/sync/types';
import { scalarChangeBuilder } from '@/lib/sync/change-builders';
import { THEME_STORAGE_KEY } from '@/lib/theme/theme-init-script';
import { useTrackedBrowserState } from '@/lib/sync/use-tracked-browser-state';
import { setAppLanguage, type AppLanguage } from '@/lib/i18n/locale';

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
  const [displayName, setDisplayName] = useTrackedSetting(
    'settings/display-name',
    settingsMessages.profile.fallbackName,
    isString
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
    'settings/ai-use-cards',
    true,
    isBoolean
  );
  const [shouldUseAiForWriting, setShouldUseAiForWriting] = useTrackedSetting(
    'settings/ai-use-writing',
    true,
    isBoolean
  );
  const [isSaved, setIsSaved] = useState(true);
  const providerOptions =
    PROVIDER_OPTIONS.find(option => option.id === provider) ??
    PROVIDER_OPTIONS[0];

  useEffect(() => {
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

  function markDirty<T>(setter: (value: SetStateAction<T>) => void) {
    return (value: T) => {
      setter(value);
      setIsSaved(false);
    };
  }

  function changeProvider(nextProvider: AiProvider) {
    setProvider(nextProvider);
    const nextOptions =
      PROVIDER_OPTIONS.find(option => option.id === nextProvider) ??
      PROVIDER_OPTIONS[0];
    setModel(nextOptions.models[0]);
    setIsSaved(false);
  }

  function saveChanges() {
    setLanguage(draftLanguage);
    setAppLanguage(draftLanguage);
    setIsSaved(true);
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
      markDirty(setIsReminderEnabled)(enabled);
      return;
    }
    if (enabled && !reminderDeliveryConfigured) {
      setReminderError(settingsMessages.profile.reminderSetupRequired);
      return;
    }
    if (enabled && !hasReminderConsent) {
      setReminderError(settingsMessages.profile.reminderConsentRequired);
      return;
    }

    const previous = isReminderEnabled;
    setIsReminderEnabled(enabled);
    void saveReminderPreferences(enabled, hasReminderConsent).catch(() => {
      setIsReminderEnabled(previous);
      setReminderError(settingsMessages.profile.reminderSaveError);
    });
  }

  function changeReminderConsent(consent: boolean) {
    if (!isAuthenticated) return;
    const wasConsented = hasReminderConsent;
    const wasEnabled = isReminderEnabled;
    setHasReminderConsent(consent);
    if (!consent && wasEnabled) setIsReminderEnabled(false);
    void saveReminderPreferences(consent ? wasEnabled : false, consent).catch(
      () => {
        setHasReminderConsent(wasConsented);
        setIsReminderEnabled(wasEnabled);
        setReminderError(settingsMessages.profile.reminderSaveError);
      }
    );
  }

  return {
    activeTab,
    setActiveTab,
    theme,
    language: draftLanguage,
    level,
    dailyGoal,
    displayName,
    isReminderEnabled,
    hasReminderConsent,
    reminderDeliveryConfigured,
    reminderError,
    isAuthenticated,
    provider,
    model,
    shouldUseAiForCards,
    shouldUseAiForWriting,
    isSaved,
    providerOptions,
    changeTheme: markDirty(setTheme),
    changeLanguage: (nextLanguage: AppLanguage) => {
      setDraftLanguage(nextLanguage);
      setIsSaved(false);
    },
    changeLevel: markDirty(setLevel),
    changeDailyGoal: markDirty(setDailyGoal),
    changeDisplayName: markDirty(setDisplayName),
    changeReminder,
    changeReminderConsent,
    changeModel: markDirty(setModel),
    changeUseAiForCards: markDirty(setShouldUseAiForCards),
    changeUseAiForWriting: markDirty(setShouldUseAiForWriting),
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
function isString(value: unknown): value is string {
  return typeof value === 'string';
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
  return useTrackedBrowserState(
    key,
    fallback,
    isValid,
    scalarChangeBuilder('settings', key)
  );
}
