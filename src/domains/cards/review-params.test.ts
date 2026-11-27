import { describe, expect, it } from 'vitest';
import { parseReviewParams } from './review-params';

describe('parseReviewParams', () => {
  it('defaults to a due round of 10 with no scope', () => {
    expect(parseReviewParams('')).toEqual({
      groupId: null,
      from: null,
      size: 10,
      mode: 'due'
    });
  });

  it('reads group, origin, size and mode', () => {
    expect(
      parseReviewParams('?groupId=g1&from=cards&size=20&mode=ahead')
    ).toEqual({ groupId: 'g1', from: 'cards', size: 20, mode: 'ahead' });
  });

  it('maps size=all to the cap and ignores invalid sizes and modes', () => {
    expect(parseReviewParams('size=all').size).toBe(50);
    expect(parseReviewParams('size=7').size).toBe(10);
    expect(parseReviewParams('mode=hack').mode).toBe('due');
  });
});
