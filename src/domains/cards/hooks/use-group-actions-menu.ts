'use client';

import { useState } from 'react';

// Static UI state for the group options menu and the delete confirmation.
// It never mutates stored data: rename, recolor and delete are not wired yet.
export function useGroupActionsMenu() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

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

  return {
    isMenuOpen,
    isConfirmingDelete,
    toggleMenu,
    closeMenu,
    askDelete,
    dismissDelete
  };
}
