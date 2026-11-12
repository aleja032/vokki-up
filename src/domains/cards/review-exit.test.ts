import { describe, expect, it } from 'vitest';
import { resolveReviewExit } from './review-exit';

describe('resolveReviewExit', () => {
  it('returns to cards when the review started from cards', () => {
    expect(resolveReviewExit('cards')).toEqual({
      href: '/cards',
      target: 'cards'
    });
  });

  it.each([null, '', 'other', 'CARDS'])('returns home for %j', from => {
    expect(resolveReviewExit(from)).toEqual({ href: '/', target: 'home' });
  });
});
