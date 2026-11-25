import { describe, expect, it } from 'vitest';
import { estimateReviewMinutes } from './review-estimate';

describe('estimateReviewMinutes', () => {
  it('takes half a minute per card, rounded up', () => {
    expect(estimateReviewMinutes(1)).toBe(1);
    expect(estimateReviewMinutes(2)).toBe(1);
    expect(estimateReviewMinutes(7)).toBe(4);
    expect(estimateReviewMinutes(10)).toBe(5);
  });

  it('is zero without cards', () => {
    expect(estimateReviewMinutes(0)).toBe(0);
  });
});
