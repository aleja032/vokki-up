import { cardsMessages } from '../messages';
import { DeckIcon } from './deck-icon';
import { GroupAddActions } from './group-add-actions';
import './group-empty-state.css';

const messages = cardsMessages.groupDetail;

/** Empty group: one primary add action plus the word library link. */
export function GroupEmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="group-empty">
      <span aria-hidden="true" className="group-empty__icon">
        <DeckIcon name="folder" size={23} />
      </span>
      <h3>{messages.emptyTitle}</h3>
      <p>{messages.emptyBody}</p>
      <GroupAddActions variant="empty" onAdd={onAdd} />
    </div>
  );
}
