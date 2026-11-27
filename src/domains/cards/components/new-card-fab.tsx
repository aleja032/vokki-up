import Image from 'next/image';
import { NewCardMenu } from './new-card-menu';
import './new-card-fab.css';

type NewCardFabProps = {
  /** Opens the add hub (image, word list and manual modes). */
  onCreate: () => void;
};

// The one place to add cards on every width: a round button floating at the
// bottom right (above the bottom navigation on phones) that opens the new card
// menu (create, import, library). The curious Noma stands beside it, decoration only.
export function NewCardFab({ onCreate }: NewCardFabProps) {
  return (
    <div className="new-card-fab">
      <span aria-hidden="true" className="new-card-fab__noma">
        <Image
          alt=""
          className="new-card-fab__noma-image"
          height={649}
          src="/images/noma-curious.png"
          width={700}
        />
      </span>
      <NewCardMenu onCreate={onCreate} />
    </div>
  );
}
