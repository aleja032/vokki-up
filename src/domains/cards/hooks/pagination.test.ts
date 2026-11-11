import { describe, expect, it } from 'vitest';
import { paginateItems } from './pagination';

describe('paginateItems', () => {
  it('returns a stable slice for the requested page', () => {
    expect(paginateItems(['a', 'b', 'c', 'd', 'e'], 2, 2)).toEqual({
      page: 2,
      pageCount: 3,
      items: ['c', 'd']
    });
  });

  it('clamps a page after a filtered result set shrinks', () => {
    expect(paginateItems(['a', 'b', 'c'], 4, 2)).toEqual({
      page: 2,
      pageCount: 2,
      items: ['c']
    });
  });

  it('keeps empty results on a valid first page', () => {
    expect(paginateItems([], 3, 2)).toEqual({
      page: 1,
      pageCount: 1,
      items: []
    });
  });
});
