'use client';

import { useState } from 'react';

export type FolderEditFocus = 'name' | 'color';

// UI state for the group options menu, the edit dialog and the delete
// confirmation. It never mutates stored data: saving and deleting go through
// the dashboard hook.
export function useGroupActionsMenu() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  // Which control the dialog focuses; kept after closing so the fade-out of the
  // dialog does not flicker to another control.
  const [editFocus, setEditFocus] = useState<FolderEditFocus>('name');

  function toggleMenu() {
    setIsMenuOpen(isOpen => !isOpen);
  }

  function closeMenu() {
    setIsMenuOpen(false);
  }

  function askDelete() {
    setIsMenuOpen(false);
    setIsConfirmingDelete(true);
  }

  function dismissDelete() {
    setIsConfirmingDelete(false);
  }

  function askEdit(focus: FolderEditFocus) {
    setIsMenuOpen(false);
    setEditFocus(focus);
    setIsEditing(true);
  }

  function dismissEdit() {
    setIsEditing(false);
  }

  return {
    isMenuOpen,
    isConfirmingDelete,
    isEditing,
    editFocus,
    toggleMenu,
    closeMenu,
    askDelete,
    dismissDelete,
    askEdit,
    dismissEdit
  };
}
