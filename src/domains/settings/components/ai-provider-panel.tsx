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
          status={props.connectionStatus}
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
                onClick={() => props.onProviderChange(option.id)}
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
              onChange={event => props.onModelChange(event.target.value)}
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
          hasError={props.connectionTest === 'error'}
          providerName={providerName}
        />

        <ConnectionTestResult
          providerName={providerName}
          test={props.connectionTest}
        />

        <footer className="prefs-footer prefs-footer--provider">
          <button
            className="prefs-remove prefs-remove--wide"
            type="button"
            disabled
          >
            <SettingsIcon name="trash" size={16} />
            {copy.removeApiKey}
          </button>
          <div className="prefs-footer__actions">
            <SettingsSaveState isSaved={props.isSaved} />
            <button
              className="prefs-button prefs-button--outline"
              type="button"
              disabled
            >
              {copy.testConnection}
            </button>
            <button
              className="prefs-button prefs-button--primary"
              onClick={props.onSave}
              type="button"
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
          disabled
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
