import Image from 'next/image';
import { Play } from 'lucide-react';
import { ActionPill } from '@/components/ui/action-pill';
import { cardsMessages } from '../messages';
import { NewCardMenu } from './new-card-menu';
import './deck-page-header.css';

const messages = cardsMessages.overview;

type DeckPageHeaderProps = {
  totalCards: number;
  groupCount: number;
  dueCount: number;
  onAddCard: () => void;
};

// Mi mazo header (proposal D): mascot, title with the deck summary, the new
// card menu and the review action. On phones the title row carries the round
// plus button and the review action takes its own full-width line.
export function DeckPageHeader({
  totalCards,
  groupCount,
  dueCount,
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
          <h1>{messages.title}</h1>
          <p className="deck-header__summary">
            {messages.summary(totalCards, groupCount)}
          </p>
        </div>
      </div>
      <div className="deck-header__actions">
        <NewCardMenu onCreate={onAddCard} />
        <ActionPill
          className="deck-header__cta"
          href="/review?from=cards"
          icon={<Play size={18} strokeWidth={2.4} />}
          variant="cta"
        >
          <span className="deck-header__cta-wide">
            {messages.reviewShort(dueCount)}
          </span>
          <span className="deck-header__cta-compact">
            {messages.reviewToday(dueCount)}
          </span>
        </ActionPill>
      </div>
    </header>
  );
}
