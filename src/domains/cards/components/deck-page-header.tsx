import Image from 'next/image';
import { ChevronRight, Globe, Play, Plus } from 'lucide-react';
import { ActionCard } from '@/components/ui/action-card';
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

// Mi mazo header (proposal D). Wide screens: mascot, title with the deck
// summary and one row of actions (new card menu, library, review). Phones: the
// title, two action cards (new card, review) and a full-width library row.
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
      <div className="deck-header__quick">
        <ActionCard
          icon={<Plus size={24} />}
          onClick={onAddCard}
          subtitle={messages.newCardSubtitle}
          title={messages.newCardTitle}
          variant="solid"
        />
        <ActionCard
          href="/review?from=cards"
          icon={<Play size={24} />}
          subtitle={messages.dueToday(dueCount)}
          title={messages.reviewTitle}
        />
      </div>
      <div className="deck-header__actions">
        <NewCardMenu onCreate={onAddCard} />
        <ActionPill
          className="deck-header__library"
          href="/cards/word-library"
          icon={<Globe size={18} strokeWidth={2.4} />}
          iconEnd={<ChevronRight size={20} />}
          variant="outline"
        >
          <span className="deck-header__library-label">
            {messages.addFromLibrary}
          </span>
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
