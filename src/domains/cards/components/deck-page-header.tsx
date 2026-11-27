import Image from 'next/image';
import { Play } from 'lucide-react';
import { ActionPill } from '@/components/ui/action-pill';
import { cardsMessages } from '../messages';
import { useReviewRoundSize } from '../hooks/use-review-round-size';
import { buildCardsReviewHref } from '../review-round-size';
import { ReviewBanner } from './review-banner';
import { RoundSizeControl } from './round-size-control';
import './deck-page-header.css';

const messages = cardsMessages.overview;

type DeckPageHeaderProps = {
  totalCards: number;
  groupCount: number;
  dueCount: number;
  /** The selected folder: the review button then follows it. */
  reviewFolder?: { id: string; name: string; dueCount: number };
};

// Mi mazo header (proposal D): the mascot, the title and the deck summary on
// the left; the main actions on the right of the same row on wide screens and
// under the title on phones. "Repasar N" is the one primary (filled mint) and
// follows the selected folder (its link, its due count, its name as the
// accessible label). Adding cards is the floating button, not a header action.
export function DeckPageHeader({
  totalCards,
  groupCount,
  dueCount,
  reviewFolder
}: DeckPageHeaderProps) {
  const [roundSize, setRoundSize] = useReviewRoundSize();
  const reviewCount = reviewFolder ? reviewFolder.dueCount : dueCount;
  return (
    <header className="deck-header">
      <div className="deck-header__brand">
        <Image
          alt=""
          aria-hidden="true"
          className="deck-header__mascot motion-mascot-bob"
          height={587}
          src="/images/noma.png"
          width={700}
        />
        <div className="deck-header__copy">
          <h1>{messages.title}</h1>
          <p className="deck-header__summary">
            {messages.summary(totalCards, groupCount)}
          </p>
        </div>
      </div>
      <div className="deck-header__side">
        <div className="deck-header__actions">
          <ActionPill
            className="deck-header__review"
            aria-label={
              reviewFolder
                ? messages.reviewFolderLabel(reviewCount, reviewFolder.name)
                : undefined
            }
            href={buildCardsReviewHref(reviewFolder?.id, roundSize)}
            icon={<Play size={18} strokeWidth={2.4} />}
            pulse={reviewCount > 0}
            variant="primary"
          >
            {messages.reviewShort(reviewCount)}
          </ActionPill>
        </div>
        <RoundSizeControl onChange={setRoundSize} size={roundSize} />
      </div>
      <ReviewBanner
        count={reviewCount}
        folder={reviewFolder}
        onRoundSizeChange={setRoundSize}
        roundSize={roundSize}
      />
    </header>
  );
}
