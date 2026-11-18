import Link from 'next/link';
import { Library } from 'lucide-react';
import { cardsMessages } from '../messages';
import { DeckIcon } from './deck-icon';

const messages = cardsMessages.groupDetail;

type GroupAddActionsProps = {
  /** `empty`: primary CTA first (inside the empty state). `header`: next to a list heading. */
  variant: 'empty' | 'header';
  onAdd: () => void;
};

/** The add actions of one group: add a card, or add from the word library. */
export function GroupAddActions({ variant, onAdd }: GroupAddActionsProps) {
  const libraryLink = (
    <Link className="deck-link-button" href="/cards/word-library">
      <Library size={16} aria-hidden="true" />
      {messages.addFromLibrary}
    </Link>
  );

  if (variant === 'empty')
    return (
      <div className="deck-group-empty__actions">
        <button type="button" onClick={onAdd}>
          <DeckIcon name="plus" size={16} />
          {messages.emptyAction}
        </button>
        {libraryLink}
      </div>
    );

  return (
    <div className="deck-screen__list-actions">
      {libraryLink}
      <button type="button" onClick={onAdd}>
        <DeckIcon name="plus" size={16} />
        {messages.add}
      </button>
    </div>
  );
}
