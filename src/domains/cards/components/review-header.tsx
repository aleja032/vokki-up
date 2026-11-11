import Link from 'next/link';
import { cardsMessages } from '../messages';
import { ReviewIcon } from './review-icon';

const messages = cardsMessages.review;

type ReviewHeaderProps = {
  position: number;
  total: number;
  progress: number;
};

export function ReviewHeader({ position, total, progress }: ReviewHeaderProps) {
  return (
    <header className="drill-header">
      <Link
        className="drill-header__close"
        href="/"
        aria-label={messages.closeLabel}
      >
        <ReviewIcon name="close" size={20} />
        <span className="drill-header__exit">{messages.exit}</span>
      </Link>
      <div className="drill-header__progress">
        <div
          className="drill-header__track"
          role="progressbar"
          aria-label={messages.progressLabel}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progress}
        >
          <div
            className="drill-header__fill"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="drill-header__count">
          {messages.count(position, total)}
        </span>
      </div>
      <span className="drill-header__offline">
        <ReviewIcon name="device" size={14} />
        {messages.offlineNotice}
      </span>
    </header>
  );
}
