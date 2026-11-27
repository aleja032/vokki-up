import { NewCardMenu } from './new-card-menu';
import './new-card-fab.css';

type NewCardFabProps = {
  /** Opens the add hub (image, word list and manual modes). */
  onCreate: () => void;
};

// The one place to add cards on every width: a round button floating at the
// bottom right (above the bottom navigation on phones) that opens the new card
// menu (create, import, library).
export function NewCardFab({ onCreate }: NewCardFabProps) {
  return (
    <div className="new-card-fab">
      <NewCardMenu onCreate={onCreate} />
    </div>
  );
}
