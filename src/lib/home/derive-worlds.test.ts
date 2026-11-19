import { describe, expect, it } from 'vitest';
import { deriveWorldProgress } from './derive-worlds';

const catalog = [
  { term: 'Deadline', category: 'Trabajo' },
  { term: 'meeting', category: 'Trabajo' },
  { term: 'luggage', category: 'Viajes' },
  { term: 'borrow', category: 'Día a día' }
];
const normalize = (term: string) => term.trim().toLowerCase();

describe('deriveWorldProgress', () => {
  it('counts owned catalog words per category, in home order', () => {
    const worlds = deriveWorldProgress(
      catalog,
      ['deadline ', 'BORROW', 'something else'],
      normalize
    );

    expect(worlds.map(world => world.id)).toEqual([
      'daily',
      'work',
      'travel',
      'phrases'
    ]);
    expect(worlds[0]).toMatchObject({ learned: 1, total: 1 });
    expect(worlds[1]).toMatchObject({ learned: 1, total: 2 });
    expect(worlds[2]).toMatchObject({ learned: 0, total: 1 });
    expect(worlds[3]).toMatchObject({ learned: 0, total: 0 });
  });
});
