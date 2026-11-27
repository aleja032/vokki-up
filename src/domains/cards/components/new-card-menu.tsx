'use client';

import { useState, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { FileUp, Globe, Plus, SquarePen } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNewCardMenu } from '../hooks/use-new-card-menu';
import { cardsMessages } from '../messages';
import './new-card-menu.css';

const messages = cardsMessages.overview;
const OPENED_KEY = 'vokki-up:cards/add-menu-opened';

function subscribeNever() {
  return () => undefined;
}

function readOpenedFlag() {
  try {
    return window.sessionStorage.getItem(OPENED_KEY) !== null;
  } catch {
    return false;
  }
}

type NewCardMenuProps = {
  /** Opens the add hub (image, word list and manual modes). */
  onCreate: () => void;
};

// The one way to add cards (floating button): a round "+" that opens a menu
// upward with manual creation, file import and the library. Its name is the
// aria-label; wide screens also get a hover/focus tooltip to its left (CSS).
// The list stays in the DOM (hidden) so every action is always in the markup.
export function NewCardMenu({ onCreate }: NewCardMenuProps) {
  const { isOpen, rootRef, toggle, close } = useNewCardMenu();
  const menuId = 'new-card-menu';
  // The attention ring stops for the rest of the session after the first open.
  const openedBefore = useSyncExternalStore(
    subscribeNever,
    readOpenedFlag,
    () => false
  );
  const [openedNow, setOpenedNow] = useState(false);
  const hasOpened = openedBefore || openedNow;

  function handleToggle() {
    if (!isOpen && !hasOpened) {
      setOpenedNow(true);
      try {
        window.sessionStorage.setItem(OPENED_KEY, '1');
      } catch {
        // Not persisting is fine.
      }
    }
    toggle();
  }

  return (
    <div
      className={cn('new-card-menu', !hasOpened && 'new-card-menu--pulse')}
      ref={rootRef}
    >
      <button
        aria-controls={menuId}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-label={messages.addShort}
        className="new-card-menu__trigger"
        onClick={handleToggle}
        type="button"
      >
        <Plus aria-hidden="true" size={26} strokeWidth={2.6} />
        <span aria-hidden="true" className="new-card-menu__tooltip">
          {messages.addShort}
        </span>
      </button>
      <div
        aria-label={messages.newCardMenuLabel}
        className="new-card-menu__list"
        hidden={!isOpen}
        id={menuId}
        role="menu"
      >
        <button
          className="new-card-menu__item"
          onClick={() => {
            close();
            onCreate();
          }}
          role="menuitem"
          type="button"
        >
          <SquarePen aria-hidden="true" size={18} />
          {messages.createCard}
        </button>
        <Link
          className="new-card-menu__item"
          href="/import-export?from=cards"
          onClick={close}
          role="menuitem"
        >
          <FileUp aria-hidden="true" size={18} />
          {messages.importFile}
        </Link>
        <Link
          className="new-card-menu__item"
          href="/cards/word-library"
          onClick={close}
          role="menuitem"
        >
          <Globe aria-hidden="true" size={18} />
          {messages.fromLibrary}
        </Link>
      </div>
    </div>
  );
}
