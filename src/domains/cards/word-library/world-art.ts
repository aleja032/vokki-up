import { WORLD_IMAGES } from '@/lib/worlds/world-images';
import type { WordLibraryCategory, WordLibraryEntry } from './catalog';
import type { WorldId } from './worlds';

/** Which semantic accent colors a world's bar and state label. */
export type WorldAccent = 'brand' | 'mint' | 'amber' | 'lavender';

export type WorldArt = {
  /** Pixel art shown by the hub card, the phone thumbnail and the banner. */
  src: string;
  accent: WorldAccent;
  /** The scene already has words drawn in it, so no floating tags on top. */
  hasWords: boolean;
};

export const WORLD_ART: Record<WorldId, WorldArt> = {
  daily: {
    src: WORLD_IMAGES.daily,
    accent: 'lavender',
    hasWords: false
  },
  work: { src: WORLD_IMAGES.work, accent: 'brand', hasWords: false },
  travel: { src: WORLD_IMAGES.travel, accent: 'mint', hasWords: false },
  phrases: {
    src: WORLD_IMAGES.phrases,
    accent: 'brand',
    hasWords: false
  }
};

const TAG_MAX_LENGTH = 12;

/** Three short real terms of a world, for the floating tags on its banner. */
export function pickWorldTagWords(
  catalog: readonly WordLibraryEntry[],
  category: WordLibraryCategory,
  count = 3
): string[] {
  const short = catalog.filter(
    entry => entry.category === category && entry.term.length <= TAG_MAX_LENGTH
  );
  const basic = short.filter(entry => entry.level === 'basic');
  return [...basic, ...short]
    .map(entry => entry.term)
    .filter((term, index, all) => all.indexOf(term) === index)
    .slice(0, count);
}
