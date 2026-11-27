import { parseRoundSize, type RoundSize } from './review-round-size';

export type ReviewMode = 'due' | 'ahead';

export type ReviewParams = {
  groupId: string | null;
  from: string | null;
  size: RoundSize;
  mode: ReviewMode;
};

// The review route's query string, validated: size and mode are whitelists
// and anything unknown falls back to a due round of 10.
export function parseReviewParams(search: string): ReviewParams {
  const params = new URLSearchParams(search);
  return {
    groupId: params.get('groupId'),
    from: params.get('from'),
    size: parseRoundSize(params.get('size')),
    mode: params.get('mode') === 'ahead' ? 'ahead' : 'due'
  };
}
