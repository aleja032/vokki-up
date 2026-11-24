import Image from 'next/image';
import { FileUp, Globe, Play } from 'lucide-react';
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

// Mi mazo header: the mascot beside the title and the deck summary, and three
// equal main actions directly under them (like a study home): "Repasar N" is
// the one primary (filled mint), "Nueva tarjeta" (a menu: manual, AI, library)
// and "Importar archivo" are secondary in the mint tone (outlined green). Phones add the library as one extra row.
export function DeckPageHeader({
  totalCards,
  groupCount,
  dueCount,
  onAddCard
}: DeckPageHeaderProps) {
  return (
    <header className="deck-header">
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
        <div className="deck-header__actions">
          <ActionPill
            className="deck-header__review"
            href="/review?from=cards"
            icon={<Play size={18} strokeWidth={2.4} />}
            pulse={dueCount > 0}
            variant="primary"
          >
            {messages.reviewShort(dueCount)}
          </ActionPill>
          <div className="deck-header__new">
            <NewCardMenu onCreate={onAddCard} />
          </div>
          <ActionPill
            className="deck-header__import"
            href="/import-export?from=cards"
            icon={<FileUp size={18} strokeWidth={2.4} />}
            tone="mint"
            variant="secondary"
          >
            {messages.importFile}
          </ActionPill>
          <ActionPill
            className="deck-header__library"
            href="/cards/word-library"
            icon={<Globe size={18} strokeWidth={2.4} />}
            tone="mint"
            variant="secondary"
          >
            {messages.addFromLibrary}
          </ActionPill>
        </div>
      </div>
    </header>
  );
}
