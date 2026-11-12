export const AVATAR_FALLBACK_INITIAL = '?';

function firstGrapheme(value: string | null | undefined): string {
  const trimmed = value?.trim() ?? '';
  if (!trimmed) return '';
  const segmenter = new Intl.Segmenter(undefined, { granularity: 'grapheme' });
  const first = segmenter.segment(trimmed)[Symbol.iterator]().next();
  return first.done ? '' : first.value.segment;
}

/** First grapheme of the display name, else of the email, else a neutral glyph. */
export function getAvatarInitial({
  displayName,
  email
}: {
  displayName?: string | null;
  email?: string | null;
}): string {
  const initial = firstGrapheme(displayName) || firstGrapheme(email);
  return initial ? initial.toLocaleUpperCase() : AVATAR_FALLBACK_INITIAL;
}
