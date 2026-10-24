'use client';

import { useState } from 'react';
import { settingsMessages } from '../messages';
import { SettingsIcon } from './settings-icon';

interface ApiKeyFieldProps {
  apiKey: string;
  hasError: boolean;
  hasSavedCredential: boolean;
  isAuthenticated: boolean;
  maskedKey: string | null;
  onApiKeyChange: (value: string) => void;
  providerName: string;
}

export function ApiKeyField({
  apiKey,
  hasError,
  hasSavedCredential,
  isAuthenticated,
  maskedKey,
  onApiKeyChange,
  providerName
}: ApiKeyFieldProps) {
  const [isVisible, setIsVisible] = useState(false);
  const copy = settingsMessages.provider;
  return (
    <div className="prefs-field">
      <div className="prefs-key__header">
        <label className="prefs-label" htmlFor="settings-api-key">
          {copy.apiKeyLabel}
        </label>
        <a className="prefs-key__help" href="#">
          {copy.apiKeyHelp}
        </a>
      </div>
      <div className="prefs-key__field">
        <input
          aria-describedby="settings-api-key-privacy"
          aria-invalid={hasError}
          autoComplete="off"
          className="prefs-input prefs-input--key"
          id="settings-api-key"
          onChange={event => onApiKeyChange(event.target.value)}
          placeholder={hasSavedCredential ? (maskedKey ?? '') : ''}
          spellCheck={false}
          type={isVisible ? 'text' : 'password'}
          value={apiKey}
        />
        <button
          aria-label={isVisible ? copy.hideApiKey : copy.showApiKey}
          className="prefs-key__toggle"
          onClick={() => setIsVisible(current => !current)}
          type="button"
        >
          <SettingsIcon name="eye" />
        </button>
      </div>
      <span className="prefs-key__privacy" id="settings-api-key-privacy">
        <SettingsIcon className="prefs-key__lock" name="lock" size={16} />
        {copy.apiKeyPrivacy(providerName, isAuthenticated)}
      </span>
    </div>
  );
}
