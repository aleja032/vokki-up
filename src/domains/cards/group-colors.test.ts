import { describe, expect, it } from 'vitest';
import {
  DEFAULT_GROUP_TONE,
  FOLDER_COLORS,
  displayTone,
  type GroupTone
} from './group-colors';

const STORED_TONES: GroupTone[] = [
  'indigo',
  'amber',
  'green',
  'blue',
  'teal',
  'coral',
  'gray',
  'lavender'
];

describe('folder palette', () => {
  it('is a closed set of six colors without orange, amber or coral', () => {
    expect(FOLDER_COLORS).toHaveLength(6);
    expect(FOLDER_COLORS).not.toContain('amber');
    expect(FOLDER_COLORS).not.toContain('coral');
    expect(FOLDER_COLORS).toContain(DEFAULT_GROUP_TONE);
  });
});

describe('displayTone', () => {
  it('keeps every color of the palette as it is', () => {
    for (const color of FOLDER_COLORS) expect(displayTone(color)).toBe(color);
  });

  it('shows the legacy amber as teal and the legacy coral as lavender', () => {
    expect(displayTone('amber')).toBe('teal');
    expect(displayTone('coral')).toBe('lavender');
  });

  it('never returns a color outside the palette', () => {
    for (const tone of STORED_TONES)
      expect(FOLDER_COLORS).toContain(displayTone(tone));
  });
});
