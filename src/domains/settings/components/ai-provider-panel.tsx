'use client';

import { useEffect, useState } from 'react';
import { setTransientAiApiKey } from '@/lib/ai/transient-api-key';
import { getSupabaseBrowserClient } from '@/lib/supabase/browser-client';
import { requestCredentials, type CredentialStatus } from '../credential-api';
import {
  extractErrorCode,
  getCredentialErrorKey,
  type CredentialErrorKey
} from '../credential-error-message.util';
import { PROVIDER_OPTIONS } from '../data';
import {
  resolveProviderSaveAction,
  type SavedCredentialSelection
} from '../ai-provider-save.util';
import { settingsMessages } from '../messages';
import { hasPendingChanges } from '../pending-changes.util';
import type { AiProvider, ConnectionStatus, ConnectionTest } from '../types';
import { ApiKeyField } from './api-key-field';
import {
  ConnectionStatusBanner,
  ConnectionTestResult
} from './connection-feedback';
import { SettingsIcon } from './settings-icon';
import { SettingsSaveState } from './settings-save-state';

interface AiProviderPanelProps {
  connectionStatus: ConnectionStatus;
  connectionTest: ConnectionTest;
  isActive: boolean;
  isLanguageDirty: boolean;
  model: string;
  models: readonly string[];
  onModelChange: (value: string) => void;
  onProviderChange: (value: AiProvider) => void;
  onSave: () => void;
  onUseForCardsChange: (value: boolean) => void;
  provider: AiProvider;
  shouldUseForCards: boolean;
}

function toSavedCredential(
  status: CredentialStatus
): SavedCredentialSelection | null {
  return status.authenticated &&
    status.hasCredential &&
    status.provider &&
    status.model
    ? { provider: status.provider, model: status.model }
    : null;
}

function readLatency(value: unknown): number | undefined {
  return typeof value === 'object' &&
    value !== null &&
    'latencyMs' in value &&
    typeof value.latencyMs === 'number'
    ? value.latencyMs
    : undefined;
}

export function AiProviderPanel(props: AiProviderPanelProps) {
  const copy = settingsMessages.provider;
  const providerName = settingsMessages.providers[props.provider].name;
  const [apiKey, setApiKey] = useState('');
  const [appliedGuestKey, setAppliedGuestKey] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [savedCredential, setSavedCredential] =
    useState<SavedCredentialSelection | null>(null);
  const [maskedKey, setMaskedKey] = useState<string | null>(null);
  const [errorKey, setErrorKey] = useState<CredentialErrorKey | null>(null);
  const [isSavingCredential, setIsSavingCredential] = useState(false);
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [connectionResult, setConnectionResult] = useState<{
    success: boolean;
    latencyMs?: number;
    error?: string;
  } | null>(null);
  const hasSavedForProvider = savedCredential?.provider === props.provider;
  const hasOtherProviderCredential =
    savedCredential !== null && !hasSavedForProvider;
  const hasCredential = hasSavedForProvider || Boolean(apiKey.trim());
  const typedKey =
    apiKey.trim() && (isAuthenticated || apiKey.trim() !== appliedGuestKey)
      ? apiKey
      : '';
  const isPending = hasPendingChanges({
    isLanguageDirty: props.isLanguageDirty,
    typedKey,
    isAuthenticated,
    savedCredential,
    selectedProvider: props.provider,
    selectedModel: props.model
  });
  const hasPreviewResult =
    props.connectionStatus === 'ok' ||
    props.connectionStatus === 'error' ||
    props.connectionTest !== 'idle';
  const connectionStatus = hasPreviewResult
    ? props.connectionStatus
    : hasCredential
      ? 'untested'
      : props.connectionStatus;
  const visibleConnectionStatus = connectionResult
    ? connectionResult.success
      ? 'ok'
      : 'error'
    : isTestingConnection
      ? 'untested'
      : connectionStatus;
  const visibleConnectionTest = isTestingConnection
    ? 'testing'
    : connectionResult
      ? connectionResult.success
        ? 'ok'
        : 'error'
      : props.connectionTest;

  useEffect(() => {
    let active = true;
    const refreshCredentialStatus = async () => {
      const result = await requestCredentials('GET', 'loadFailed');
      if (!active) return;
      if (!result.ok) {
        setErrorKey(result.errorKey);
        return;
      }
      const saved = toSavedCredential(result.status);
      setIsAuthenticated(result.status.authenticated);
      setSavedCredential(saved);
      setMaskedKey(saved ? result.status.maskedKey : null);
      if (result.status.authenticated) setTransientAiApiKey(null);
    };
    void refreshCredentialStatus();
    window.addEventListener('focus', refreshCredentialStatus);
    const supabase = getSupabaseBrowserClient();
    const { data } = supabase?.auth.onAuthStateChange(() => {
      void refreshCredentialStatus();
    }) ?? { data: { subscription: null } };
    return () => {
      active = false;
      window.removeEventListener('focus', refreshCredentialStatus);
      data.subscription?.unsubscribe();
    };
  }, []);

  function clearTypedKey() {
    setApiKey('');
    setAppliedGuestKey('');
    setTransientAiApiKey(null);
  }

  async function saveProviderSettings() {
    setErrorKey(null);
    const action = resolveProviderSaveAction({
      isAuthenticated,
      typedKey: apiKey,
      savedCredential,
      selectedProvider: props.provider,
      selectedModel: props.model
    });
    if (action.kind === 'needs-key-for-provider') {
      setErrorKey('needsKeyForProvider');
      return;
    }
    if (action.kind === 'post' || action.kind === 'patch') {
      setIsSavingCredential(true);
      const selection = { provider: action.provider, model: action.model };
      const result =
        action.kind === 'post'
          ? await requestCredentials('POST', 'saveFailed', {
              ...selection,
              apiKey: action.apiKey
            })
          : await requestCredentials('PATCH', 'saveFailed', selection);
      setIsSavingCredential(false);
      if (!result.ok) {
        setErrorKey(result.errorKey);
        return;
      }
      setSavedCredential(selection);
      setMaskedKey(result.status.maskedKey ?? maskedKey);
      clearTypedKey();
    } else if (action.kind === 'transient') {
      setTransientAiApiKey(action.apiKey);
      setAppliedGuestKey(action.apiKey);
    }
    props.onSave();
  }

  async function deleteProviderCredential() {
    setErrorKey(null);
    if (isAuthenticated && hasSavedForProvider) {
      const result = await requestCredentials('DELETE', 'deleteFailed');
      if (!result.ok) {
        setErrorKey(result.errorKey);
        return;
      }
    }
    clearTypedKey();
    setSavedCredential(null);
    setMaskedKey(null);
  }

  async function testConnection() {
    setConnectionResult(null);
    setErrorKey(null);
    setIsTestingConnection(true);
    try {
      const response = await fetch('/api/ai/connection-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          selection: { provider: props.provider, model: props.model },
          ...(!isAuthenticated && apiKey.trim()
            ? { apiKey: apiKey.trim() }
            : {})
        }),
        cache: 'no-store'
      });
      const value: unknown = await response.json();
      if (!response.ok) {
        setConnectionResult({
          success: false,
          error: copy.errors[getCredentialErrorKey(extractErrorCode(value))],
          latencyMs: readLatency(value)
        });
        return;
      }
      setConnectionResult({ success: true, latencyMs: readLatency(value) });
    } catch {
      setConnectionResult({ success: false, error: copy.genericError });
    } finally {
      setIsTestingConnection(false);
    }
  }

  return (
    <section
      aria-labelledby="settings-tab-provider"
      className="prefs-panel"
      hidden={!props.isActive}
      id="settings-provider"
      role="tabpanel"
    >
      <div className="prefs-card">
        <ConnectionStatusBanner
          model={props.model}
          providerName={providerName}
          status={visibleConnectionStatus}
        />
        <fieldset className="prefs-group">
          <legend className="prefs-legend prefs-legend--strong">
            {copy.providerLabel}
          </legend>
          <div
            aria-label={copy.providerLabel}
            className="prefs-providers"
            role="radiogroup"
          >
            {PROVIDER_OPTIONS.map(option => (
              <button
                aria-checked={props.provider === option.id}
                className="prefs-provider"
                key={option.id}
                onClick={() => {
                  setConnectionResult(null);
                  setErrorKey(null);
                  if (option.id !== props.provider) clearTypedKey();
                  props.onProviderChange(option.id);
                }}
                role="radio"
                type="button"
              >
                <span aria-hidden="true" className="prefs-provider__radio">
                  <span className="prefs-provider__dot" />
                </span>
                <span className="prefs-provider__copy">
                  <span className="prefs-provider__name">
                    {settingsMessages.providers[option.id].name}
                  </span>
                  <span className="prefs-provider__hint">
                    {settingsMessages.providers[option.id].hint}
                  </span>
                </span>
              </button>
            ))}
          </div>
        </fieldset>
        <div className="prefs-fields prefs-fields--model">
          <div className="prefs-field">
            <label className="prefs-label" htmlFor="settings-model">
              {copy.modelLabel}
            </label>
            <select
              className="prefs-input prefs-input--select"
              id="settings-model"
              onChange={event => {
                setConnectionResult(null);
                props.onModelChange(event.target.value);
              }}
              value={props.model}
            >
              {props.models.map(value => (
                <option key={value}>{value}</option>
              ))}
            </select>
            <span className="prefs-hint prefs-field__hint">
              {copy.modelHint}
            </span>
          </div>
        </div>
        <ApiKeyField
          apiKey={apiKey}
          hasError={visibleConnectionTest === 'error' || errorKey !== null}
          hasSavedCredential={hasSavedForProvider}
          isAuthenticated={isAuthenticated}
          maskedKey={hasSavedForProvider ? maskedKey : null}
          onApiKeyChange={value => {
            setApiKey(value);
            setTransientAiApiKey(isAuthenticated ? null : value);
          }}
          providerName={providerName}
        />
        {hasSavedForProvider && savedCredential && (
          <span className="prefs-hint">
            {copy.savedApiKey}: {savedCredential.provider} ·{' '}
            {savedCredential.model}
          </span>
        )}
        {hasOtherProviderCredential && (
          <span className="prefs-hint">{copy.keyNeededForProvider}</span>
        )}
        {errorKey && (
          <span className="prefs-hint" role="alert">
            {copy.errors[errorKey]}
          </span>
        )}
        <ConnectionTestResult
          errorMessage={connectionResult?.error}
          latencyMs={connectionResult?.latencyMs}
          providerName={providerName}
          test={visibleConnectionTest}
        />
        <footer className="prefs-footer prefs-footer--provider">
          <button
            className="prefs-remove prefs-remove--wide"
            type="button"
            disabled={!hasSavedForProvider && !apiKey}
            onClick={deleteProviderCredential}
          >
            <SettingsIcon name="trash" size={16} />
            {copy.removeApiKey}
          </button>
          <div className="prefs-footer__actions">
            <SettingsSaveState isSaved={!isPending} />
            <button
              className="prefs-button prefs-button--outline"
              type="button"
              disabled={
                isTestingConnection ||
                (isAuthenticated ? !hasSavedForProvider : !apiKey.trim())
              }
              onClick={testConnection}
            >
              {isTestingConnection
                ? copy.testingConnection
                : copy.testConnection}
            </button>
            <button
              className="prefs-button prefs-button--primary"
              onClick={saveProviderSettings}
              type="button"
              disabled={isSavingCredential || !isPending}
            >
              {copy.save}
            </button>
          </div>
        </footer>
      </div>
      <aside className="prefs-aside">
        <button
          className="prefs-remove prefs-remove--narrow"
          type="button"
          disabled={!hasSavedForProvider && !apiKey}
          onClick={deleteProviderCredential}
        >
          <SettingsIcon name="trash" size={16} />
          {copy.removeApiKey}
        </button>
        <section aria-labelledby="settings-how-title" className="prefs-how">
          <h2 className="prefs-how__title" id="settings-how-title">
            {copy.howTitle}
          </h2>
          <ul className="prefs-how__list">
            {copy.howItems.map(item => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      </aside>
    </section>
  );
}
