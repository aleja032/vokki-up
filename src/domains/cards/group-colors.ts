// Tones a user can pick when creating a group. The color values live in
// `src/app/globals.css` as CSS custom properties driven by `data-tone`.
export const GROUP_TONES = [
  'indigo',
  'green',
  'amber',
  'teal',
  'coral',
  'gray'
] as const;

export type GroupTone = (typeof GROUP_TONES)[number];

export const DEFAULT_GROUP_TONE: GroupTone = 'coral';
