import { settingsMessages } from '../messages';
import { SettingsIcon } from './settings-icon';

export function SettingsSaveState({ isSaved }: { isSaved: boolean }) {
  return (
    <span aria-live="polite" className="prefs-save-state">
      <SettingsIcon name="check" size={15} />{' '}
      {isSaved ? settingsMessages.save.saved : settingsMessages.save.unsaved}
    </span>
  );
}
