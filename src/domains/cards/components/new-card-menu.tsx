'use client';

import Link from 'next/link';
import { ChevronDown, Library, Plus, SquarePen } from 'lucide-react';
import { ActionPill } from '@/components/ui/action-pill';
import { useNewCardMenu } from '../hooks/use-new-card-menu';
import { cardsMessages } from '../messages';
import './new-card-menu.css';

const messages = cardsMessages.overview;
const MENU_ID = 'new-card-menu';

type NewCardMenuProps = {
  /** Opens the add hub (image, word list and manual modes). */
  onCreate: () => void;
};

// "Nueva tarjeta" menu button (proposal D): one outlined trigger that offers
// the ways to add cards. Icon-only on phones, labelled with a chevron on wide
// screens. The list stays in the DOM (hidden) so both actions are always in
// the markup.
export function NewCardMenu({ onCreate }: NewCardMenuProps) {
  const { isOpen, rootRef, toggle, close } = useNewCardMenu();

  return (
    <div className="new-card-menu" ref={rootRef}>
      <ActionPill
        aria-controls={MENU_ID}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-label={messages.newCardTitle}
        className="new-card-menu__trigger"
        icon={<Plus size={18} strokeWidth={2.6} />}
        iconEnd={<ChevronDown className="new-card-menu__chevron" size={18} />}
        onClick={toggle}
        variant="line"
      >
        <span className="new-card-menu__label">{messages.newCardTitle}</span>
      </ActionPill>
      <div
        aria-label={messages.newCardMenuLabel}
        className="new-card-menu__list"
        hidden={!isOpen}
        id={MENU_ID}
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
          href="/cards/word-library"
          onClick={close}
          role="menuitem"
        >
          <Library aria-hidden="true" size={18} />
          {messages.addFromLibrary}
        </Link>
      </div>
    </div>
  );
}
