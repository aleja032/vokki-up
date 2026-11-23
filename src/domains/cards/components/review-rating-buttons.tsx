import { PixelLabel } from '@/components/ui/pixel-label';
import { cardsMessages } from '../messages';
import type { CardRating } from '../types';
import { REVIEW_RATINGS } from '../hooks/use-card-review';
import './review-rating-buttons.css';

const messages = cardsMessages.review;

type ReviewRatingButtonsProps = {
  getIntervalLabel: (rating: CardRating) => string;
  onRate: (rating: CardRating) => void;
};

// Three tone-coded rating buttons, each with the next review interval.
export function ReviewRatingButtons({
  getIntervalLabel,
  onRate
}: ReviewRatingButtonsProps) {
  return (
    <div
      className="review-ratings"
      role="group"
      aria-label={messages.ratingsLabel}
    >
      <span className="review-ratings__prompt">{messages.ratingPrompt}</span>
      <div className="review-ratings__grid">
        {REVIEW_RATINGS.map(rating => (
          <button
            className="review-rating"
            data-tone={rating}
            type="button"
            key={rating}
            onClick={() => onRate(rating)}
          >
            <span className="review-rating__label">
              {messages.ratings[rating]}
            </span>
            <span className="review-rating__when">
              <span aria-hidden="true" className="review-rating__dot" />
              <PixelLabel className="review-rating__hint">
                {getIntervalLabel(rating)}
              </PixelLabel>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
