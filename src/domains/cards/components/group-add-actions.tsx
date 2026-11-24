import { Library, Plus } from 'lucide-react';
import { ActionPill } from '@/components/ui/action-pill';
import { cardsMessages } from '../messages';
import './group-add-actions.css';

const messages = cardsMessages.groupDetail;

type GroupAddActionsProps = {
  /** `empty`: primary CTA first (inside the empty state). `header`: next to a list heading. */
  variant: 'empty' | 'header';
  onAdd: () => void;
};

/** The add actions of one group: add a card, or add from the word library. */
export function GroupAddActions({ variant, onAdd }: GroupAddActionsProps) {
  const libraryLink = (
    <ActionPill
      href="/cards/word-library"
      icon={<Library size={16} strokeWidth={2.2} />}
      size="sm"
      tone="mint"
      variant="tertiary"
    >
      {messages.addFromLibrary}
    </ActionPill>
  );
  const addButton = (
    <ActionPill
      icon={<Plus size={16} strokeWidth={2.4} />}
      onClick={onAdd}
      size="sm"
      tone="mint"
      variant="secondary"
    >
      {variant === 'empty' ? messages.emptyAction : messages.add}
    </ActionPill>
  );

  if (variant === 'empty')
    return (
      <div className="group-add-actions group-add-actions--empty">
        {addButton}
        {libraryLink}
      </div>
    );

  return (
    <div className="group-add-actions">
      {libraryLink}
      {addButton}
    </div>
  );
}
