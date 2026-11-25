'use client';

import Link from 'next/link';
import { ChevronDown, FileUp, Globe, Plus, SquarePen } from 'lucide-react';
import { ActionPill } from '@/components/ui/action-pill';
import { cn } from '@/lib/utils';
import { useNewCardMenu } from '../hooks/use-new-card-menu';
import { cardsMessages } from '../messages';
import './new-card-menu.css';

const messages = cardsMessages.overview;

type NewCardMenuProps = {
  /** Opens the add hub (image, word list and manual modes). */
  onCreate: () => void;
  /**
   * `pill` is the outlined header button (manual and file; the library is its
   * own action of the page header). `fab` is the floating round button of
   * phones, which also lists the library because the header actions are gone.
   */
  variant?: 'pill' | 'fab';
};

// "Nueva tarjeta" menu button (proposal D): one trigger that offers the ways to
// add cards. The list stays in the DOM (hidden) so every action is always in
// the markup. Each variant has its own menu id, so both can live in one page.
export function NewCardMenu({ onCreate, variant = 'pill' }: NewCardMenuProps) {
  const { isOpen, rootRef, toggle, close } = useNewCardMenu();
  const isFab = variant === 'fab';
  const menuId = isFab ? 'new-card-menu-fab' : 'new-card-menu';

  return (
    <div
      className={cn('new-card-menu', isFab && 'new-card-menu--fab')}
      ref={rootRef}
    >
      {isFab ? (
        <button
          aria-controls={menuId}
          aria-expanded={isOpen}
          aria-haspopup="menu"
          aria-label={messages.addShort}
          className="new-card-menu__trigger new-card-menu__trigger--fab"
          onClick={toggle}
          type="button"
        >
          <Plus aria-hidden="true" size={26} strokeWidth={2.6} />
        </button>
      ) : (
        <ActionPill
          aria-controls={menuId}
          aria-expanded={isOpen}
          aria-haspopup="menu"
          aria-label={messages.newCardTitle}
          className="new-card-menu__trigger"
          icon={<Plus size={18} strokeWidth={2.6} />}
          iconEnd={<ChevronDown className="new-card-menu__chevron" size={18} />}
          onClick={toggle}
          tone="mint"
          variant="secondary"
        >
          <span className="new-card-menu__label">{messages.newCardTitle}</span>
        </ActionPill>
      )}
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
        {isFab ? (
          <Link
            className="new-card-menu__item"
            href="/cards/word-library"
            onClick={close}
            role="menuitem"
          >
            <Globe aria-hidden="true" size={18} />
            {messages.fromLibrary}
          </Link>
        ) : null}
      </div>
    </div>
  );
}
