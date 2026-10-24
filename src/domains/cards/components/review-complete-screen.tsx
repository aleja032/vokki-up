import Link from 'next/link';
import { cardsMessages } from '../messages';
import { ReviewIcon } from './review-icon';

const messages = cardsMessages.review;

type ReviewCompleteScreenProps = {
  reviewed: number;
  hard: number;
  good: number;
  easy: number;
  streakDays: number;
  onRestart: () => void;
};

export function ReviewCompleteScreen({
  reviewed,
  hard,
  good,
  easy,
  streakDays,
  onRestart
}: ReviewCompleteScreenProps) {
  return (
    <section className="drill-done" aria-labelledby="review-done-title">
      <div className="drill-done__body">
        <span className="drill-done__icon">
          <ReviewIcon name="check" size={44} />
        </span>
        <h1 className="drill-done__title" id="review-done-title">
          {messages.done.title}
        </h1>
        <p className="drill-done__text">
          {messages.done.reviewed(reviewed)}
          {streakDays > 0 && (
            <>
              {' '}
              {messages.done.streakPrefix}{' '}
              <strong>{messages.done.streakDays(streakDays)}</strong>.
            </>
          )}{' '}
          {messages.done.nextReturn}
        </p>
        <div className="drill-done__chips">
          <span className="drill-done__chip" data-tone="again">
            {messages.done.hardChip(hard)}
          </span>
          <span className="drill-done__chip" data-tone="good">
            {messages.done.goodChip(good)}
          </span>
          <span className="drill-done__chip" data-tone="easy">
            {messages.done.easyChip(easy)}
          </span>
        </div>
      </div>
      <div className="drill-done__actions">
        <button
          className="drill-done__repeat"
          type="button"
          onClick={onRestart}
        >
          {messages.done.repeat}
          <span className="drill-done__repeat-suffix">
            {' '}
            {messages.done.repeatSuffix}
          </span>
        </button>
        <Link className="drill-done__primary" href="/">
          {messages.done.backHome}
        </Link>
      </div>
      <p className="drill-done__note">{messages.done.repeatNote}</p>
    </section>
  );
}
