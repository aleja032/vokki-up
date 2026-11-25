'use client';

import { ActionPill } from '@/components/ui/action-pill';
import { FormDialog } from '@/components/overlay/form-dialog';
import { SwatchPicker } from '@/components/ui/swatch-picker';
import { FOLDER_COLORS, type FolderColor } from '../group-colors';
import { useFolderEditSubmit } from '../hooks/use-folder-edit-submit';
import { cardsMessages } from '../messages';
import type { CardGroup } from '../types';
import type { GroupPatch } from '../update-group';
import { DeckFieldError } from './deck-field-error';
import './folder-edit-dialog.css';

const messages = cardsMessages.groupDetail;
const NAME_FIELD_ID = 'folder-edit-name';
const NAME_ERROR_ID = 'folder-edit-name-error';
const NAME_LOCKED_ID = 'folder-edit-name-locked';

// Read at render time so the names follow the selected language.
function getColorOptions() {
  const colorNames = cardsMessages.groupCreate.colorNames;
  return FOLDER_COLORS.map(color => ({
    value: color,
    label: colorNames[color],
    color
  }));
}

type FolderEditDialogProps = {
  open: boolean;
  group: CardGroup;
  /** Names the folder cannot take (the other folders and the reserved one). */
  otherGroupNames: readonly string[];
  /** Which control takes the focus when the dialog opens. */
  focus: 'name' | 'color';
  onSave: (patch: GroupPatch) => void;
  onClose: () => void;
};

// One dialog for "Renombrar" and "Cambiar color": the name field and the color
// swatches. It opens on the control the menu item asked for.
export function FolderEditDialog({
  open,
  group,
  otherGroupNames,
  focus,
  onSave,
  onClose
}: FolderEditDialogProps) {
  return (
    <FormDialog open={open} title={messages.editTitle} onClose={onClose}>
      <FolderEditForm
        focus={focus}
        group={group}
        onClose={onClose}
        onSave={onSave}
        otherGroupNames={otherGroupNames}
      />
    </FormDialog>
  );
}

type FolderEditFormProps = Omit<FolderEditDialogProps, 'open'>;

function FolderEditForm({
  group,
  otherGroupNames,
  focus,
  onSave,
  onClose
}: FolderEditFormProps) {
  const {
    register,
    onSubmit,
    tone,
    defaultName,
    nameError,
    isNameLocked,
    canSave,
    selectTone
  } = useFolderEditSubmit({ group, otherGroupNames, onSave });
  const describedBy = nameError
    ? NAME_ERROR_ID
    : isNameLocked
      ? NAME_LOCKED_ID
      : undefined;

  return (
    <form className="folder-edit" noValidate onSubmit={onSubmit}>
      <div className="deck-field">
        <label htmlFor={NAME_FIELD_ID}>{messages.editNameLabel}</label>
        <input
          aria-describedby={describedBy}
          aria-invalid={Boolean(nameError)}
          aria-readonly={isNameLocked || undefined}
          autoComplete="off"
          className="deck-field__input"
          data-autofocus={focus === 'name' ? '' : undefined}
          defaultValue={defaultName}
          id={NAME_FIELD_ID}
          readOnly={isNameLocked}
          type="text"
          {...register('name')}
        />
        {nameError ? (
          <DeckFieldError id={NAME_ERROR_ID} role="alert">
            {nameError}
          </DeckFieldError>
        ) : null}
        {isNameLocked ? (
          <p className="folder-edit__hint" id={NAME_LOCKED_ID}>
            {messages.menuRenameLocked}
          </p>
        ) : null}
      </div>

      <SwatchPicker
        autoFocusSelected={focus === 'color'}
        legend={messages.editColorLegend}
        name="folder-edit-color"
        onChange={value => selectTone(value as FolderColor)}
        options={getColorOptions()}
        value={tone}
      />

      <div className="folder-edit__actions">
        <ActionPill onClick={onClose} variant="secondary">
          {messages.editCancel}
        </ActionPill>
        <ActionPill disabled={!canSave} type="submit" variant="primary">
          {messages.editSave}
        </ActionPill>
      </div>
    </form>
  );
}
