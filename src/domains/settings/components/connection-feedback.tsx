import { settingsMessages } from '../messages';
import type { ConnectionStatus, ConnectionTest } from '../types';
import { SettingsIcon } from './settings-icon';

interface ConnectionStatusBannerProps {
  model: string;
  providerName: string;
  status: ConnectionStatus;
}

export function ConnectionStatusBanner({
  model,
  providerName,
  status
}: ConnectionStatusBannerProps) {
  const copy = settingsMessages.connectionStatus[status];

  return (
    <div className="prefs-status" data-status={status} role="status">
      <span aria-hidden="true" className="prefs-status__dot" />
      <span className="prefs-status__copy">
        <span className="prefs-status__title">{copy.title}</span>
        <span className="prefs-status__text">
          {copy.text(providerName, model)}
        </span>
      </span>
    </div>
  );
}

interface ConnectionTestResultProps {
  errorMessage?: string;
  latencyMs?: number;
  providerName: string;
  test: ConnectionTest;
}

export function ConnectionTestResult({
  errorMessage,
  latencyMs,
  providerName,
  test
}: ConnectionTestResultProps) {
  const copy = settingsMessages.connectionTest;

  if (test === 'testing') {
    return (
      <div className="prefs-result prefs-result--testing" role="status">
        <span aria-hidden="true" className="prefs-spinner" />
        <span>{copy.testing}</span>
      </div>
    );
  }
  if (test === 'ok') {
    return (
      <div className="prefs-result prefs-result--ok" role="status">
        <SettingsIcon className="prefs-result__icon" name="check" />
        <span>
          <strong>{copy.okTitle}</strong> {copy.okText(providerName, latencyMs)}
        </span>
      </div>
    );
  }
  if (test === 'error') {
    return (
      <div className="prefs-result prefs-result--error" role="alert">
        <SettingsIcon className="prefs-result__icon" name="warning" />
        <span>
          <strong>
            {errorMessage ? copy.errorGenericTitle : copy.errorTitle}
          </strong>{' '}
          {errorMessage ?? copy.errorText(providerName)}
          {errorMessage && latencyMs !== undefined
            ? copy.errorLatency(latencyMs)
            : ''}
        </span>
      </div>
    );
  }
  return null;
}
