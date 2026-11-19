import Image from 'next/image';
import { cardsMessages } from '../messages';

const messages = cardsMessages.review.status;

// Combos shorter than this get no cheer.
const MIN_CHEER_COMBO = 2;

function NomaImage({ className }: { className: string }) {
  return (
    <Image
      alt=""
      aria-hidden="true"
      className={className}
      height={587}
      src="/images/noma.png"
      width={700}
    />
  );
}

// Phones: Noma perched on the top corner of the card.
export function ReviewCompanionBadge() {
  return <NomaImage className="review-companion__badge motion-mascot-bob" />;
}

// Tablet and desktop: Noma beside the card, cheering a running combo.
export function ReviewCompanion({ combo }: { combo: number }) {
  return (
    <aside className="review-companion">
      {combo >= MIN_CHEER_COMBO ? (
        <p className="review-companion__bubble" role="status">
          {messages.comboBubble(combo)}
        </p>
      ) : null}
      <NomaImage className="review-companion__pet motion-mascot-bob" />
    </aside>
  );
}
