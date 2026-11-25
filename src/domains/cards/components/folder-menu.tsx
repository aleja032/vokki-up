'use client';

import { Ellipsis } from 'lucide-react';
import { ConfirmDialog } from '@/components/overlay/confirm-dialog';
import { actionPillClass } from '@/components/ui/action-pill';
import { cn } from '@/lib/utils';
import { isOthers } from '../delete-group';
import { getGroupDisplayName } from '../group-display';
import {
  useGroupActionsMenu,
  type FolderEditFocus
} from '../hooks/use-group-actions-menu';
import { useNewCardMenu } from '../hooks/use-new-card-menu';
import { cardsMessages } from '../messages';
import type { CardGroup } from '../types';
import type { GroupPatch } from '../update-group';
import { FolderEditDialog } from './folder-edit-dialog';
import './folder-menu.css';

const messages = cardsMessages.groupDetail;
const MENU_ID = 'folder-menu';
const BLOCKED_HINT_ID = 'folder-menu-blocked';
const RENAME_LOCKED_HINT_ID = 'folder-menu-rename-locked';

type FolderMenuProps = {
  group: CardGroup;
  /** Cards of the folder: the confirm dialog says how many move to "Otros". */
  cardCount: number;
  /** False for a folder that cannot be deleted yet (a non-empty "Otros"). */
  isDeletable: boolean;
  /** Names the folder cannot take when renamed (other folders, reserved). */
  otherGroupNames: readonly string[];
  /** Applies a rename and/or recolor of the folder. */
  onUpdate: (groupId: string, patch: GroupPatch) => void;
  onDelete: (groupId: string) => void;
};

// Options of the selected folder: rename and change color (one edit dialog,
// opened on the control each item names) and delete (with the shared confirm
// dialog). The list stays in the DOM (hidden) while closed, like
// the new card menu. Open, Escape and outside press come from the new card menu
// hook; the delete confirmation from the folder actions hook.
export function FolderMenu({
  group,
  cardCount,
  isDeletable,
  otherGroupNames,
  onUpdate,
  onDelete
}: FolderMenuProps) {
  const { isOpen, rootRef, toggle, close } = useNewCardMenu();
  const {
    isConfirmingDelete,
    isEditing,
    editFocus,
    askDelete,
    dismissDelete,
    askEdit,
    dismissEdit
  } = useGroupActionsMenu();
  const isRenamable = !isOthers(group);

  function handleEditClick(focus: FolderEditFocus) {
    close();
    askEdit(focus);
  }

  function handleSave(patch: GroupPatch) {
    dismissEdit();
    onUpdate(group.id, patch);
  }

  function handleDeleteClick() {
    close();
    askDelete();
  }

  return (
    <div className="folder-menu" ref={rootRef}>
      <button
        aria-controls={MENU_ID}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-label={messages.menuLabel}
        className={cn(
          actionPillClass('tertiary', 'md', 'mint'),
          'folder-menu__trigger'
        )}
        onClick={toggle}
        type="button"
      >
        <Ellipsis aria-hidden="true" size={22} />
      </button>
      <div
        aria-label={messages.menuAriaLabel}
        className="folder-menu__list"
        hidden={!isOpen}
        id={MENU_ID}
        role="menu"
      >
        <button
          aria-describedby={isRenamable ? undefined : RENAME_LOCKED_HINT_ID}
          className="folder-menu__item"
          disabled={!isRenamable}
          onClick={() => handleEditClick('name')}
          role="menuitem"
          type="button"
        >
          {messages.menuRename}
        </button>
        {!isRenamable && (
          <span className="folder-menu__hint" id={RENAME_LOCKED_HINT_ID}>
            {messages.menuRenameLocked}
          </span>
        )}
        <button
          className="folder-menu__item"
          onClick={() => handleEditClick('color')}
          role="menuitem"
          type="button"
        >
          {messages.menuRecolor}
        </button>
        <button
          aria-describedby={isDeletable ? undefined : BLOCKED_HINT_ID}
          className="folder-menu__item folder-menu__item--danger"
          disabled={!isDeletable}
          onClick={handleDeleteClick}
          role="menuitem"
          type="button"
        >
          {messages.menuDelete}
        </button>
        {!isDeletable && (
          <span className="folder-menu__hint" id={BLOCKED_HINT_ID}>
            {messages.menuDeleteBlocked}
          </span>
        )}
      </div>
      <FolderEditDialog
        focus={editFocus}
        group={group}
        onClose={dismissEdit}
        onSave={handleSave}
        open={isEditing}
        otherGroupNames={otherGroupNames}
      />
      <ConfirmDialog
        open={isConfirmingDelete}
        title={messages.deleteTitle}
        description={messages.deleteBody(getGroupDisplayName(group), cardCount)}
        confirmLabel={messages.deleteConfirm}
        cancelLabel={messages.deleteCancel}
        onConfirm={() => {
          dismissDelete();
          onDelete(group.id);
        }}
        onCancel={dismissDelete}
      />
    </div>
  );
}
