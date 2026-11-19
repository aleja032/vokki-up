import type { PillTone } from '@/components/ui/tone.types';

// Accent used for a category in the list (color bar), the open note tag and
// the section labels. Custom categories fall back to the brand tone.
const CATEGORY_TONES: Record<string, PillTone> = {
  General: 'neutral',
  Expresiones: 'mint',
  Gramática: 'brand',
  Cultura: 'amber',
  Ideas: 'coral'
};

export function getNoteCategoryTone(category: string): PillTone {
  return CATEGORY_TONES[category] ?? 'brand';
}

// Section labels inside an open note alternate between two accents.
export function getNoteSectionTone(sectionIndex: number): PillTone {
  return sectionIndex % 2 === 0 ? 'mint' : 'coral';
}
