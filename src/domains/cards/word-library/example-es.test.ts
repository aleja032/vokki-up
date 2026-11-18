import { describe, expect, it } from 'vitest';
import { normalizeCatalogTerm, wordLibraryCatalog } from './catalog';
import {
  getCatalogEntryExampleEs,
  getExampleEs,
  parseExampleRows
} from './example-es';
import { DAILY_EXAMPLES_ES } from './example-es-daily';
import { PHRASES_EXAMPLES_ES } from './example-es-phrases';
import { TRAVEL_EXAMPLES_ES } from './example-es-travel';
import { WORK_EXAMPLES_ES } from './example-es-work';
import type { VocabularyCard } from '../types';

const catalogEntry = wordLibraryCatalog.find(
  entry => entry.term === 'follow up'
)!;

function makeCard(overrides: Partial<VocabularyCard> = {}): VocabularyCard {
  return {
    id: 'card-1',
    term: 'follow up',
    meaning: 'dar seguimiento',
    phonetics: '',
    example: catalogEntry.example,
    partOfSpeech: 'Expresión',
    groupId: 'work',
    tags: [],
    ...overrides
  };
}

describe('Spanish example data coverage', () => {
  const rows = [
    ...WORK_EXAMPLES_ES,
    ...TRAVEL_EXAMPLES_ES,
    ...DAILY_EXAMPLES_ES,
    ...PHRASES_EXAMPLES_ES
  ];
  const parsed = parseExampleRows(rows);

  it('has one well-formed row per catalog entry and no extras', () => {
    expect(parsed.size).toBe(rows.length);
    expect(parsed.size).toBe(wordLibraryCatalog.length);
    for (const entry of wordLibraryCatalog)
      expect(parsed.has(normalizeCatalogTerm(entry.term)), entry.term).toBe(
        true
      );
  });

  it('translates every entry with a non-empty sentence that differs from the English one', () => {
    for (const entry of wordLibraryCatalog) {
      const spanish = getExampleEs({
        ...makeCard(),
        term: entry.term,
        example: entry.example
      });
      expect(spanish, entry.term).toBeTruthy();
      expect(spanish, entry.term).not.toBe(entry.example);
    }
  });

  it('keeps ending punctuation consistent with the English example', () => {
    for (const entry of wordLibraryCatalog) {
      const spanish = getExampleEs({
        ...makeCard(),
        term: entry.term,
        example: entry.example
      })!;
      expect(/[.?!]$/.test(spanish), entry.term).toBe(true);
      expect(spanish.endsWith('?'), entry.term).toBe(
        entry.example.endsWith('?')
      );
      expect(spanish.split('¿').length, entry.term).toBe(
        spanish.split('?').length
      );
    }
  });

  it('has no unjustified duplicate Spanish sentences', () => {
    const seen = new Map<string, string>();
    for (const [term, spanish] of parsed) {
      expect(seen.get(spanish), `${term} duplicates ${seen.get(spanish)}`).toBe(
        undefined
      );
      seen.set(spanish, term);
    }
  });

  it('keeps country-specific vocabulary out of the examples', () => {
    // Neutral international Spanish: these regionalisms were replaced on purpose.
    const denylist =
      /(botanas?|trapea|chamarras?|ahorita|platica|vosotros|vos|arepas|laptops?|foco|mandados|mesero|cuadras|alacena|ecotour|riñonera|cartilla)|equipaje documentado|hora feliz|ticket de soporte|guante de cocina|pase de abordar/i;
    for (const spanish of parsed.values())
      expect(denylist.test(spanish), spanish).toBe(false);
  });

  it('never wraps the sentence in quotes', () => {
    for (const spanish of parsed.values())
      expect(/^["“”«']|["“”»']$/.test(spanish), spanish).toBe(false);
  });
});

describe('getExampleEs', () => {
  it('prefers the Spanish example stored on the card', () => {
    expect(getExampleEs(makeCard({ exampleEs: 'Ejemplo propio.' }))).toBe(
      'Ejemplo propio.'
    );
  });

  it('falls back to the catalog translation by normalized term', () => {
    expect(getExampleEs(makeCard({ term: '  Follow   Up ' }))).toBe(
      'Me pondré en contacto contigo mañana para dar seguimiento.'
    );
  });

  it('returns undefined for a term outside the catalog', () => {
    expect(
      getExampleEs(makeCard({ term: 'zzz custom word', example: 'Hi.' }))
    ).toBeUndefined();
  });

  it('returns undefined when the English example no longer matches the catalog', () => {
    expect(
      getExampleEs(makeCard({ example: 'A completely different sentence.' }))
    ).toBeUndefined();
  });

  it('ignores a blank stored value and falls back', () => {
    expect(getExampleEs(makeCard({ exampleEs: '   ' }))).toBe(
      'Me pondré en contacto contigo mañana para dar seguimiento.'
    );
  });
});

describe('getCatalogEntryExampleEs', () => {
  it('returns the catalog translation of an entry', () => {
    expect(getCatalogEntryExampleEs(catalogEntry)).toBe(
      'Me pondré en contacto contigo mañana para dar seguimiento.'
    );
  });

  it('covers every catalog entry', () => {
    for (const entry of wordLibraryCatalog)
      expect(getCatalogEntryExampleEs(entry), entry.id).toBeTruthy();
  });

  it('returns undefined for an entry outside the catalog', () => {
    expect(
      getCatalogEntryExampleEs({ term: 'not in catalog', example: 'x.' })
    ).toBeUndefined();
  });
});
