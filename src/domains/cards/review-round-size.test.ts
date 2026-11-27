import { describe, expect, it } from 'vitest';
import {
  DEFAULT_ROUND_SIZE,
  buildCardsReviewHref,
  countRoundCards,
  isRoundSize,
  parseRoundSize
} from './review-round-size';

describe('parseRoundSize', () => {
  it('accepts the whitelist and maps "all" to the hard cap', () => {
    expect(parseRoundSize('10')).toBe(10);
    expect(parseRoundSize('20')).toBe(20);
    expect(parseRoundSize('50')).toBe(50);
    expect(parseRoundSize('all')).toBe(50);
  });

  it('ignores anything else', () => {
    expect(parseRoundSize(null)).toBe(DEFAULT_ROUND_SIZE);
    expect(parseRoundSize('15')).toBe(10);
    expect(parseRoundSize('9999')).toBe(10);
    expect(parseRoundSize('-5')).toBe(10);
    expect(parseRoundSize('')).toBe(10);
  });
});

describe('isRoundSize', () => {
  it('validates stored values', () => {
    expect(isRoundSize(20)).toBe(true);
    expect(isRoundSize(15)).toBe(false);
    expect(isRoundSize('20')).toBe(false);
  });
});

describe('countRoundCards', () => {
  it('is the round size or the due cards, whichever is smaller', () => {
    expect(countRoundCards(10, 3)).toBe(3);
    expect(countRoundCards(10, 40)).toBe(10);
    expect(countRoundCards(50, 40)).toBe(40);
    expect(countRoundCards(50, 400)).toBe(50);
    expect(countRoundCards(20, 0)).toBe(0);
  });
});

describe('buildCardsReviewHref', () => {
  it('keeps the plain links at the default size', () => {
    expect(buildCardsReviewHref(undefined, 10)).toBe('/review?from=cards');
    expect(buildCardsReviewHref('g 1', 10)).toBe(
      '/review?groupId=g%201&from=cards'
    );
  });

  it('adds the size when it is not the default', () => {
    expect(buildCardsReviewHref(undefined, 20)).toBe(
      '/review?from=cards&size=20'
    );
    expect(buildCardsReviewHref('g1', 50)).toBe(
      '/review?groupId=g1&from=cards&size=50'
    );
  });
});
