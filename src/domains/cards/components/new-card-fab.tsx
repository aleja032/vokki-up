import { NewCardMenu } from './new-card-menu';
import './new-card-fab.css';

type NewCardFabProps = {
  /** Opens the add hub (image, word list and manual modes). */
  onCreate: () => void;
};

// Phones: the one place to add cards. A round button floating above the bottom
// navigation that opens the new card menu (create, import, library); the header
// actions it replaces are hidden on phones. From 761px the header keeps them.
export function NewCardFab({ onCreate }: NewCardFabProps) {
  return (
    <div className="new-card-fab">
      <NewCardMenu onCreate={onCreate} variant="fab" />
    </div>
  );
}
