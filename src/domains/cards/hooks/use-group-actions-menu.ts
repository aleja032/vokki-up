'use client';

import { useState } from 'react';

// UI state for the group options menu and the delete confirmation. It never
// mutates stored data: deleting goes through the dashboard hook.
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
