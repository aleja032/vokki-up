'use client';

import { cardsMessages } from '../messages';
import { useCardReview } from '../hooks/use-card-review';
import { ReviewCardScreen } from './review-card-screen';
import { ReviewCompleteScreen } from './review-complete-screen';
import { ReviewEmptyScreen } from './review-empty-screen';
import { ReviewHeader } from './review-header';
import { ReviewStatusChips } from './review-status-chips';
import './review.css';

export function CardReview() {
  const review = useCardReview();

  if (review.status === 'loading') {
    return (
      <div className="drill-page">
        <p className="drill-loading" aria-live="polite">
          {cardsMessages.review.loading}
        </p>
      </div>
    );
  }

  const isReviewing = review.status === 'reviewing';
  const isComplete = review.status === 'complete';
  const { results } = review;

  return (
    <div className="drill-page">
      <div className="drill-shell">
        {!isComplete && (
          <ReviewHeader
            position={review.position}
            total={review.total}
            isReviewing={isReviewing}
            exitHref={review.reviewExit.href}
          />
        )}
        {isReviewing && (
          <ReviewStatusChips
            combo={review.combo}
            correct={results.good + results.easy}
            reviewed={results.reviewed}
          />
        )}
        <main className="drill-main">
          {review.status === 'empty' && <ReviewEmptyScreen />}
          {isComplete && (
            <ReviewCompleteScreen
              reviewed={results.reviewed}
              again={results.again}
              hard={results.hard}
              good={results.good}
              easy={results.easy}
              streakDays={review.streakDays}
              bestCombo={review.bestCombo}
              memoryGains={review.memoryGains}
              onRestart={review.restart}
              exitHref={review.reviewExit.href}
              exitTarget={review.reviewExit.target}
            />
          )}
          {isReviewing && review.card && (
            <ReviewCardScreen
              card={review.card}
              isRevealed={review.isRevealed}
              memory={review.memory}
              combo={review.combo}
              getIntervalLabel={review.getIntervalLabel}
              onReveal={review.reveal}
              onRate={review.rate}
            />
          )}
        </main>
      </div>
    </div>
  );
}
