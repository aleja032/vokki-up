'use client';

import { useEffect, useRef, useState } from 'react';

// UI state of the "new card" menu: open/closed, closing on Escape (focus goes
// back to the trigger) and on a press outside of the menu.
export function useNewCardMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    function closeOnOutsidePress(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setIsOpen(false);
    }

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key !== 'Escape') return;
      setIsOpen(false);
      rootRef.current?.querySelector<HTMLElement>('[aria-haspopup]')?.focus();
    }

    document.addEventListener('pointerdown', closeOnOutsidePress);
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.removeEventListener('pointerdown', closeOnOutsidePress);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [isOpen]);

  return {
    isOpen,
    rootRef,
    toggle: () => setIsOpen(open => !open),
    close: () => setIsOpen(false)
  };
}
