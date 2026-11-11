import { aiMessages } from '../messages';
import type { CapturedCardSummary } from '../types';
import { AiCaptureIcon } from './ai-capture-icon';
import './ai-panes.css';
import { translateText } from '@/lib/i18n/locale';

const messages = aiMessages.createdPanel;

type AiCreatedPanelProps = {
  cards: CapturedCardSummary[];
  onDone: () => void;
  onCreateMore: () => void;
};

/** Confirmation shown inside the hub after the accepted proposals became cards. */
export function AiCreatedPanel({
  cards,
  onDone,
  onCreateMore
}: AiCreatedPanelProps) {
  return (
    <div className="aipane-created">
      <span className="aipane-created__icon" aria-hidden="true">
        <AiCaptureIcon name="check" size={36} />
      </span>
      <h3>{messages.title(cards.length)}</h3>
      <p>{messages.body}</p>
      <ul className="aipane-created__list" aria-label={messages.listLabel}>
        {cards.map(card => (
          <li key={card.id}>
            <span className="aipane-created__term" title={card.term}>
              {card.term}
            </span>
            <span className="aipane-created__meaning" title={card.meaning}>
              {card.meaning}
            </span>
            <span
              className="aipane-created__category"
              data-category={card.partOfSpeech}
              title={translateText(card.partOfSpeech)}
            >
              {translateText(card.partOfSpeech)}
            </span>
          </li>
        ))}
      </ul>
      <div className="aipane-created__actions">
        <button
          className="aipane-created__secondary"
          type="button"
          onClick={onCreateMore}
        >
          {messages.createMore}
        </button>
        <button
          className="aipane-created__primary"
          type="button"
          onClick={onDone}
        >
          {messages.done}
        </button>
      </div>
    </div>
  );
}
