import { describe, expect, it } from 'vitest';
import { wordLibraryCatalog } from './catalog';
import { pickWorldTagWords, WORLD_ART } from './world-art';
import { WORLDS } from './worlds';

describe('world art', () => {
  it('gives every world its own art, accent and a text-safe flag', () => {
    const sources = WORLDS.map(world => WORLD_ART[world.id].src);

    expect(new Set(sources).size).toBe(WORLDS.length);
    for (const world of WORLDS) {
      expect(WORLD_ART[world.id].src).toMatch(
        /^\/images\/world-.+\.(png|svg)$/
      );
      expect(['brand', 'mint', 'amber', 'lavender']).toContain(
        WORLD_ART[world.id].accent
      );
    }
  });

  it('uses the cafe scene for daily life', () => {
    expect(WORLD_ART.daily.src).toBe('/images/world-park-day.png');
  });

  it('picks short real words of the world for the floating tags', () => {
    for (const world of WORLDS) {
      const words = pickWorldTagWords(wordLibraryCatalog, world.category);
      const terms = wordLibraryCatalog
        .filter(entry => entry.category === world.category)
        .map(entry => entry.term);

      expect(words).toHaveLength(3);
      for (const word of words) {
        expect(terms).toContain(word);
        expect(word.length).toBeLessThanOrEqual(12);
      }
    }
  });
});
