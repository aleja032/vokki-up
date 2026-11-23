import { ActionPill } from '@/components/ui/action-pill';
import { cardsMessages } from '../messages';
import { ReviewIcon } from './review-icon';
import './review-results.css';

const messages = cardsMessages.review.empty;

export function ReviewEmptyScreen() {
  return (
    <section className="round-results" aria-labelledby="review-empty-title">
      <div className="round-results__stage">
        <span aria-hidden="true" className="round-results__badge">
          <ReviewIcon name="check" size={44} />
        </span>
      </div>
      <div className="round-results__body">
        <header className="round-results__heading">
          <h1 className="round-results__title" id="review-empty-title">
            {messages.title}
          </h1>
        </header>
        <p className="round-results__text">{messages.body}</p>
        <div className="round-results__actions">
          <ActionPill
            className="round-results__primary"
            href="/cards"
            variant="primary"
          >
            {messages.action}
          </ActionPill>
        </div>
      </div>
    </section>
  );
}
