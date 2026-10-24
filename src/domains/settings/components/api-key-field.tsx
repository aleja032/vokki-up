'use client';

import { useState } from 'react';
import { settingsMessages } from '../messages';
import { SettingsIcon } from './settings-icon';

interface ApiKeyFieldProps {
  hasError: boolean;
  providerName: string;
}

/** Static field: the key is not stored or sent anywhere yet. Only the show/hide toggle is interactive. */
export function ApiKeyField({ hasError, providerName }: ApiKeyFieldProps) {
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
          aria-invalid={hasError}
          autoComplete="off"
          className="prefs-input prefs-input--key"
          id="settings-api-key"
          spellCheck={false}
          type={isVisible ? 'text' : 'password'}
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
      <span className="prefs-key__privacy">
        <SettingsIcon className="prefs-key__lock" name="lock" size={16} />
        {copy.apiKeyPrivacy(providerName)}
      </span>
    </div>
  );
}
