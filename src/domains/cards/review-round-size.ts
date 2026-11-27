// How many cards one review round holds. "Todas" is the hard cap: every due
// card, never more than MAX_ROUND_SIZE in one round.
export const ROUND_SIZES = [10, 20, 50] as const;
export type RoundSize = (typeof ROUND_SIZES)[number];

export const DEFAULT_ROUND_SIZE: RoundSize = 10;
export const MAX_ROUND_SIZE: RoundSize = 50;
export const ROUND_SIZE_STORAGE_KEY = 'cards/review-round-size';

export function isRoundSize(value: unknown): value is RoundSize {
  return ROUND_SIZES.some(size => size === value);
}

// Query param to size. Whitelist only; `all` is the cap, anything else falls
// back to the default.
export function parseRoundSize(raw: string | null | undefined): RoundSize {
  if (raw === 'all') return MAX_ROUND_SIZE;
  return ROUND_SIZES.find(size => String(size) === raw) ?? DEFAULT_ROUND_SIZE;
}

// What the review button says: the round size or what is due, the smaller.
export function countRoundCards(size: RoundSize, dueCount: number): number {
  return Math.min(size, Math.max(0, dueCount));
}

// The review link of Mi mazo. The size is only written when it is not the
// default, so the plain links stay as they were.
export function buildCardsReviewHref(
  groupId: string | undefined,
  size: RoundSize
): string {
  const scope = groupId ? `groupId=${encodeURIComponent(groupId)}&` : '';
  const sizeParam = size === DEFAULT_ROUND_SIZE ? '' : `&size=${size}`;
  return `/review?${scope}from=cards${sizeParam}`;
}
