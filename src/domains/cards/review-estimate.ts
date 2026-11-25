const MINUTES_PER_CARD = 0.5;

// Rough length of a review round: half a minute per card, rounded up. The
// round is already capped (10 cards) by whoever passes the count.
export function estimateReviewMinutes(cardCount: number) {
  return Math.ceil(cardCount * MINUTES_PER_CARD);
}
