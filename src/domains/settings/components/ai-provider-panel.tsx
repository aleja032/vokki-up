'use client';

import { useEffect, useState } from 'react';
import { setTransientAiApiKey } from '@/domains/ai/client';
import { getSupabaseBrowserClient } from '@/lib/supabase/browser-client';
import { PROVIDER_OPTIONS } from '../data';
import { settingsMessages } from '../messages';
import type { AiProvider, ConnectionStatus, ConnectionTest } from '../types';
import { ApiKeyField } from './api-key-field';
import {
  ConnectionStatusBanner,
  ConnectionTestResult
} from './connection-feedback';
import { SettingsIcon } from './settings-icon';
import { SettingsSaveState } from './settings-save-state';
import { SettingsSwitch } from './settings-switch';

interface AiProviderPanelProps {
  connectionStatus: ConnectionStatus;
  connectionTest: ConnectionTest;
  isActive: boolean;
  isSaved: boolean;
  model: string;
  models: readonly string[];
  onModelChange: (value: string) => void;
  onProviderChange: (value: AiProvider) => void;
  onSave: () => void;
  onUseForCardsChange: (value: boolean) => void;
  onUseForWritingChange: (value: boolean) => void;
  provider: AiProvider;
  shouldUseForCards: boolean;
  shouldUseForWriting: boolean;
}

export function AiProviderPanel(props: AiProviderPanelProps) {
  const copy = settingsMessages.provider;
  const providerName = settingsMessages.providers[props.provider].name;
  const [apiKey, setApiKey] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasSavedCredential, setHasSavedCredential] = useState(false);
  const [maskedKey, setMaskedKey] = useState<string | null>(null);
  const [savedSelection, setSavedSelection] = useState<string | null>(null);
  const [credentialError, setCredentialError] = useState('');
  const [isSavingCredential, setIsSavingCredential] = useState(false);
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [connectionResult, setConnectionResult] = useState<{
    success: boolean;
    latencyMs?: number;
    error?: string;
  } | null>(null);
  const hasCredential = hasSavedCredential || Boolean(apiKey.trim());
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
      try {
        const response = await fetch('/api/settings/ai-credentials', {
          cache: 'no-store'
        });
        const value: unknown = await response.json();
        if (
          !active ||
          !response.ok ||
          typeof value !== 'object' ||
          value === null
        )
          return;
        const status = value as {
          authenticated?: boolean;
          hasCredential?: boolean;
          maskedKey?: string;
          provider?: string;
          model?: string;
        };
        const authenticated = status.authenticated === true;
        setIsAuthenticated(authenticated);
        setHasSavedCredential(authenticated && status.hasCredential === true);
        setMaskedKey(
          typeof status.maskedKey === 'string' ? status.maskedKey : null
        );
        setSavedSelection(
          authenticated &&
            status.hasCredential &&
            status.provider &&
            status.model
            ? `${status.provider} · ${status.model}`
            : null
        );
        if (authenticated) setTransientAiApiKey(null);
      } catch {
        if (active)
          setCredentialError('No se pudo cargar el estado de la API key.');
      }
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

  async function saveProviderSettings() {
    setCredentialError('');
    if (apiKey.trim()) {
      if (isAuthenticated) {
        setIsSavingCredential(true);
        try {
          const response = await fetch('/api/settings/ai-credentials', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              provider: props.provider,
              model: props.model,
              apiKey: apiKey.trim()
            }),
            cache: 'no-store'
          });
          const value = await response.json();
          if (!response.ok) throw new Error('No se pudo guardar la API key.');
          setHasSavedCredential(value.hasCredential === true);
          setMaskedKey(
            typeof value.maskedKey === 'string' ? value.maskedKey : null
          );
          setSavedSelection(`${props.provider} · ${props.model}`);
          setApiKey('');
          setTransientAiApiKey(null);
        } catch (error) {
          setCredentialError(
            error instanceof Error
              ? error.message
              : 'No se pudo guardar la API key.'
          );
          setIsSavingCredential(false);
          return;
        }
        setIsSavingCredential(false);
      } else {
        setTransientAiApiKey(apiKey);
      }
    }
    props.onSave();
  }

  async function deleteProviderCredential() {
    setCredentialError('');
    if (isAuthenticated && hasSavedCredential) {
      const response = await fetch('/api/settings/ai-credentials', {
        method: 'DELETE',
        cache: 'no-store'
      });
      if (!response.ok) {
        setCredentialError('No se pudo eliminar la API key guardada.');
        return;
      }
    }
    setApiKey('');
    setTransientAiApiKey(null);
    setHasSavedCredential(false);
    setMaskedKey(null);
    setSavedSelection(null);
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
          hasError={visibleConnectionTest === 'error' || !!credentialError}
          hasSavedCredential={hasSavedCredential}
          isAuthenticated={isAuthenticated}
          maskedKey={maskedKey}
          onApiKeyChange={value => {
            setApiKey(value);
            setTransientAiApiKey(isAuthenticated ? null : value);
          }}
          providerName={providerName}
        />
        {savedSelection && (
          <span className="prefs-hint">
            {copy.savedApiKey}: {savedSelection}
          </span>
        )}
        {credentialError && (
          <span className="prefs-hint" role="alert">
            {credentialError}
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
            disabled={!hasSavedCredential && !apiKey}
            onClick={deleteProviderCredential}
          >
            <SettingsIcon name="trash" size={16} />
            {copy.removeApiKey}
          </button>
          <div className="prefs-footer__actions">
            <SettingsSaveState isSaved={props.isSaved} />
            <button
              className="prefs-button prefs-button--outline"
              type="button"
              disabled={
                isTestingConnection ||
                (isAuthenticated ? !hasSavedCredential : !apiKey.trim())
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
              disabled={isSavingCredential}
            >
              {copy.save}
            </button>
          </div>
        </footer>
      </div>
      <aside className="prefs-aside">
        <section aria-labelledby="settings-uses-title" className="prefs-uses">
          <h2 className="prefs-uses__title" id="settings-uses-title">
            {copy.usesTitle}
          </h2>
          <div className="prefs-use">
            <span className="prefs-use__copy">
              <span className="prefs-use__label">{copy.useCards}</span>
              <span className="prefs-hint">{copy.useCardsHint}</span>
            </span>
            <SettingsSwitch
              isChecked={props.shouldUseForCards}
              label={copy.useCards}
              onChange={props.onUseForCardsChange}
            />
          </div>
          <div className="prefs-use">
            <span className="prefs-use__copy">
              <span className="prefs-use__label">{copy.useWriting}</span>
              <span className="prefs-hint">
                <span className="prefs-narrow-only">
                  {copy.useWritingHintNarrow}
                </span>
                <span className="prefs-wide-only">
                  {copy.useWritingHintWide}
                </span>
              </span>
            </span>
            <SettingsSwitch
              isChecked={props.shouldUseForWriting}
              label={copy.useWriting}
              onChange={props.onUseForWritingChange}
            />
          </div>
        </section>
        <button
          className="prefs-remove prefs-remove--narrow"
          type="button"
          disabled={!hasSavedCredential && !apiKey}
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

  async function testConnection() {
    setConnectionResult(null);
    setCredentialError('');
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
        const errorMessage =
          typeof value === 'object' &&
          value !== null &&
          'error' in value &&
          typeof value.error === 'object' &&
          value.error !== null &&
          'message' in value.error &&
          typeof value.error.message === 'string'
            ? value.error.message
            : copy.genericError;
        const latencyMs =
          typeof value === 'object' &&
          value !== null &&
          'latencyMs' in value &&
          typeof value.latencyMs === 'number'
            ? value.latencyMs
            : undefined;
        setConnectionResult({ success: false, error: errorMessage, latencyMs });
        return;
      }
      const latencyMs =
        typeof value === 'object' &&
        value !== null &&
        'latencyMs' in value &&
        typeof value.latencyMs === 'number'
          ? value.latencyMs
          : undefined;
      setConnectionResult({ success: true, latencyMs });
    } catch {
      setConnectionResult({ success: false, error: copy.genericError });
    } finally {
      setIsTestingConnection(false);
    }
  }
}
