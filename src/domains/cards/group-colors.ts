import type { CardGroup } from './types';

// Colors a user can pick for a folder: a closed palette without orange, amber
// or coral. The values live in `src/app/globals.css` as `--folder-*` tokens
// (light and dark) selected through `data-folder-color`.
export const FOLDER_COLORS = [
  'indigo',
  'lavender',
  'blue',
  'teal',
  'green',
  'gray'
] as const;

export type FolderColor = (typeof FOLDER_COLORS)[number];

/** Any tone a stored group can carry, including the legacy amber and coral. */
export type GroupTone = CardGroup['tone'];

export const DEFAULT_GROUP_TONE: FolderColor = 'indigo';

// Folders saved before the palette was closed may still carry amber or coral
// (seed folders such as Viajes). They are displayed with an allowed color:
// amber as teal, coral as lavender. The stored value is never rewritten until
// the user recolors the folder.
const DISPLAY_TONES: Record<GroupTone, FolderColor> = {
  indigo: 'indigo',
  lavender: 'lavender',
  blue: 'blue',
  teal: 'teal',
  green: 'green',
  gray: 'gray',
  amber: 'teal',
  coral: 'lavender'
};

export function displayTone(tone: GroupTone): FolderColor {
  return DISPLAY_TONES[tone] ?? DEFAULT_GROUP_TONE;
}
