'use client';

import { useEffect, useState, type SetStateAction } from 'react';
import { APP_LANGUAGES, LEARNING_LEVELS, PROVIDER_OPTIONS } from '../data';
import { settingsMessages } from '../messages';
import type { AiProvider, AppTheme, SettingsTab } from '../types';
import type { JsonValue } from '@/lib/sync/types';
import { scalarChangeBuilder } from '@/lib/sync/change-builders';
import { useTrackedBrowserState } from '@/lib/sync/use-tracked-browser-state';

export function useSettingsPreferences(initialTab: SettingsTab = 'profile') {
  const [activeTab, setActiveTab] = useState<SettingsTab>(initialTab);
  const [theme, setTheme] = useTrackedSetting<AppTheme>(
    'settings/theme',
    'light',
    isAppTheme
  );
  const [language, setLanguage] = useTrackedSetting(
    'settings/language',
    'Español',
    isAppLanguage
  );
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
    if (theme === 'system') delete document.documentElement.dataset.theme;
    else document.documentElement.dataset.theme = theme;
  }, [theme]);

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
    // Setting hooks persist immediately; this button confirms the current local state.
    setIsSaved(true);
  }

  return {
    activeTab,
    setActiveTab,
    theme,
    language,
    level,
    dailyGoal,
    displayName,
    isReminderEnabled,
    provider,
    model,
    shouldUseAiForCards,
    shouldUseAiForWriting,
    isSaved,
    providerOptions,
    changeTheme: markDirty(setTheme),
    changeLanguage: markDirty(setLanguage),
    changeLevel: markDirty(setLevel),
    changeDailyGoal: markDirty(setDailyGoal),
    changeDisplayName: markDirty(setDisplayName),
    changeReminder: markDirty(setIsReminderEnabled),
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
