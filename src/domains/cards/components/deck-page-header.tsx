import Image from 'next/image';
import { Library, Play, Plus } from 'lucide-react';
import { ActionPill } from '@/components/ui/action-pill';
import { HeaderStreakPill } from '@/components/layout/header-streak-pill';
import { cardsMessages } from '../messages';
import './deck-page-header.css';

const messages = cardsMessages.overview;

type DeckPageHeaderProps = {
  totalCards: number;
  dueCount: number;
  masteredCount: number;
  onAddCard: () => void;
};

// Mi mazo header (proposal D): mascot, title with the deck summary, and the
// three actions. On phones the review action comes first and the mascot is
// dropped; the streak pill replaces the shell header the page hides there.
export function DeckPageHeader({
  totalCards,
  dueCount,
  masteredCount,
  onAddCard
}: DeckPageHeaderProps) {
  return (
    <header className="deck-header">
      <div className="deck-header__identity">
        <Image
          alt=""
          aria-hidden="true"
          className="deck-header__mascot motion-mascot-bob"
          height={587}
          src="/images/noma.png"
          width={700}
        />
        <div className="deck-header__copy">
          <div className="deck-header__title-row">
            <h1>{messages.title}</h1>
            <span className="deck-header__streak">
              <HeaderStreakPill />
            </span>
          </div>
          <p className="deck-header__summary">
            {messages.summary(totalCards, dueCount, masteredCount)}
          </p>
        </div>
      </div>
      <div className="deck-header__actions">
        <ActionPill
          aria-label={messages.addFromLibrary}
          className="deck-header__action"
          href="/cards/word-library"
          icon={<Library size={18} strokeWidth={2.2} />}
        >
          <span className="deck-header__label--compact">
            {messages.addFromLibraryShort}
          </span>
          <span className="deck-header__label--wide">
            {messages.addFromLibrary}
          </span>
        </ActionPill>
        <ActionPill
          className="deck-header__action"
          icon={<Plus size={18} strokeWidth={2.2} />}
          onClick={onAddCard}
          variant="brand"
        >
          {messages.newCardTitle}
        </ActionPill>
        <ActionPill
          className="deck-header__cta"
          href="/review?from=cards"
          icon={<Play size={18} strokeWidth={2.4} />}
          variant="cta"
        >
          {messages.reviewShort(dueCount)}
        </ActionPill>
      </div>
    </header>
  );
}
