import { describe, expect, it } from 'vitest';
import {
  normalizeCatalogTerm,
  WORD_LIBRARY_CATEGORIES,
  wordLibraryCatalog
} from './catalog';
import {
  findWorld,
  getWorldDisplayName,
  summarizeWorlds,
  WORLDS
} from './worlds';
import { setAppLanguage } from '@/lib/i18n/locale';

describe('worlds', () => {
  it('maps every catalog category to exactly one world', () => {
    expect(WORLDS.map(world => world.category).sort()).toEqual(
      [...WORD_LIBRARY_CATEGORIES].sort()
    );
  });

  it('counts real catalog words and the words already in the deck', () => {
    const work = wordLibraryCatalog.filter(
      entry => entry.category === 'Trabajo'
    );
    const owned = new Set(
      work.slice(0, 3).map(entry => normalizeCatalogTerm(entry.term))
    );
    const summary = summarizeWorlds(wordLibraryCatalog, owned);
    const world = summary.find(item => item.id === 'work');

    expect(world?.total).toBe(work.length);
    expect(world?.inDeck).toBe(3);
    expect(summary.find(item => item.id === 'travel')?.inDeck).toBe(0);
  });

  it('splits each world by level and keeps the totals consistent', () => {
    for (const world of summarizeWorlds(wordLibraryCatalog, new Set())) {
      const levelTotal = Object.values(world.levels).reduce(
        (sum, level) => sum + level.total,
        0
      );
      expect(levelTotal).toBe(world.total);
    }
  });

  it('finds worlds by id and ignores unknown ids', () => {
    expect(findWorld('daily')?.category).toBe('Día a día');
    expect(findWorld('nope')).toBeUndefined();
    expect(findWorld(null)).toBeUndefined();
  });

  it('shows the English seed name only in English', () => {
    const daily = WORLDS[0];
    expect(getWorldDisplayName(daily)).toBe('Día a día');
    setAppLanguage('English');
    expect(getWorldDisplayName(daily)).toBe('Daily life');
    setAppLanguage('Español');
  });
});
