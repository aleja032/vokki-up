import { describe, expect, it } from 'vitest';
import { getPageNumbers, paginateItems } from './pagination';

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

describe('getPageNumbers', () => {
  it('lists every page when there are few', () => {
    expect(getPageNumbers(2, 4)).toEqual([1, 2, 3, 4]);
  });

  it('keeps the first and last page and the neighbours of the current one', () => {
    expect(getPageNumbers(1, 9)).toEqual([1, 2, 'gap', 9]);
    expect(getPageNumbers(5, 9)).toEqual([1, 'gap', 4, 5, 6, 'gap', 9]);
    expect(getPageNumbers(9, 9)).toEqual([1, 'gap', 8, 9]);
  });

  it('does not add a gap between consecutive pages', () => {
    expect(getPageNumbers(3, 9)).toEqual([1, 2, 3, 4, 'gap', 9]);
  });
});
