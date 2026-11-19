import { X } from 'lucide-react';
import { ActionPill } from '@/components/ui/action-pill';
import { ProgressBar } from '@/components/ui/progress-bar';
import { cardsMessages } from '../messages';
import './review-header.css';

const messages = cardsMessages.review;

// Above this many cards the segments get too thin to read: use a plain bar.
const MAX_SEGMENTS = 24;

type ReviewHeaderProps = {
  position: number;
  total: number;
  /** True while a card is on screen: its segment is highlighted. */
  isReviewing: boolean;
  exitHref: string;
};

export function ReviewHeader({
  position,
  total,
  isReviewing,
  exitHref
}: ReviewHeaderProps) {
  const hasCards = total > 0;
  const isSegmented = hasCards && total <= MAX_SEGMENTS;

  return (
    <header className="review-header">
      <ActionPill
        aria-label={messages.closeLabel}
        className="review-header__exit"
        href={exitHref}
        icon={<X size={18} strokeWidth={2.2} />}
        size="sm"
      >
        <span className="review-header__exit-text">{messages.exit}</span>
      </ActionPill>
      <ProgressBar
        className="review-header__progress"
        currentIndex={isReviewing ? position - 1 : undefined}
        label={messages.progressLabel}
        max={hasCards ? total : 1}
        segments={isSegmented ? total : undefined}
        shape="blocks"
        tone="mint"
        value={hasCards ? position : 1}
      />
      <span className="review-header__count">
        {messages.count(position, total)}
      </span>
    </header>
  );
}
