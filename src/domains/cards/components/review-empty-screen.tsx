import Link from 'next/link';
import { cardsMessages } from '../messages';
import { ReviewIcon } from './review-icon';

const messages = cardsMessages.review.empty;

export function ReviewEmptyScreen() {
  return (
    <section className="drill-done" aria-labelledby="review-empty-title">
      <div className="drill-done__body">
        <span className="drill-done__icon">
          <ReviewIcon name="check" size={44} />
        </span>
        <h1 className="drill-done__title" id="review-empty-title">
          {messages.title}
        </h1>
        <p className="drill-done__text">{messages.body}</p>
      </div>
      <div className="drill-done__actions">
        <Link className="drill-done__primary" href="/cards">
          {messages.action}
        </Link>
      </div>
    </section>
  );
}
