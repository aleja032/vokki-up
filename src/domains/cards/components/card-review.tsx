'use client';

import { cardsMessages } from '../messages';
import { useCardReview } from '../hooks/use-card-review';
import { ReviewCardScreen } from './review-card-screen';
import { ReviewCompleteScreen } from './review-complete-screen';
import { ReviewEmptyScreen } from './review-empty-screen';
import { ReviewHeader } from './review-header';
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

  return (
    <div className="drill-page">
      <ReviewHeader
        position={review.position}
        total={review.total}
        progress={review.status === 'reviewing' ? review.progress : 100}
      />
      <main className="drill-main">
        {review.status === 'empty' && <ReviewEmptyScreen />}
        {review.status === 'complete' && (
          <ReviewCompleteScreen
            reviewed={review.results.reviewed}
            hard={review.results.hard}
            good={review.results.good}
            easy={review.results.easy}
            streakDays={review.streakDays}
            onRestart={review.restart}
          />
        )}
        {review.status === 'reviewing' && review.card && (
          <ReviewCardScreen
            card={review.card}
            isRevealed={review.isRevealed}
            getIntervalLabel={review.getIntervalLabel}
            onReveal={review.reveal}
            onRate={review.rate}
          />
        )}
      </main>
    </div>
  );
}
