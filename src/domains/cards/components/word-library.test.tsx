import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { INITIAL_GROUPS } from '../data';
import {
  getDefaultGroupId,
  paginateWordLibraryEntries,
  WordLibraryEntryCard,
  sortWordLibraryEntries,
  WORD_LIBRARY_PAGE_SIZE
} from './word-library';
import {
  normalizeCatalogTerm,
  wordLibraryCatalog
} from '../word-library/catalog';

describe('word library default collections', () => {
  it('maps every catalog category to its matching default collection', () => {
    expect(getDefaultGroupId('Trabajo', INITIAL_GROUPS)).toBe('work');
    expect(getDefaultGroupId('Viajes', INITIAL_GROUPS)).toBe('travel');
    expect(getDefaultGroupId('Día a día', INITIAL_GROUPS)).toBe('daily');
    expect(getDefaultGroupId('Frases útiles', INITIAL_GROUPS)).toBe('phrases');
  });

  it('does not return a collection that is not present in the user groups', () => {
    expect(
      getDefaultGroupId(
        'Viajes',
        INITIAL_GROUPS.filter(group => group.id !== 'travel')
      )
    ).toBeUndefined();
  });

  it('routes by category name when a collection has a generated ID', () => {
    const generatedGroups = INITIAL_GROUPS.map((group, index) => ({
      ...group,
      id: `group-${index + 1}`
    }));

    expect(getDefaultGroupId('Trabajo', generatedGroups)).toBe('group-1');
    expect(getDefaultGroupId('Viajes', generatedGroups)).toBe('group-2');
    expect(getDefaultGroupId('Día a día', generatedGroups)).toBe('group-3');
    expect(getDefaultGroupId('Frases útiles', generatedGroups)).toBe('group-4');
  });

  it('paginates catalog entries without skipping or repeating entries', () => {
    const entries = Array.from({ length: 55 }, (_, index) => index);
    const firstPage = paginateWordLibraryEntries(entries, 1);
    const secondPage = paginateWordLibraryEntries(entries, 2);
    const thirdPage = paginateWordLibraryEntries(entries, 3);

    expect(WORD_LIBRARY_PAGE_SIZE).toBe(24);
    expect(firstPage).toHaveLength(24);
    expect(secondPage).toHaveLength(24);
    expect(thirdPage).toHaveLength(7);
    expect([...firstPage, ...secondPage, ...thirdPage]).toEqual(entries);
  });

  it('places owned entries after available entries without reordering either group', () => {
    const entries = [
      { id: 'owned-a', term: 'Already owned' },
      { id: 'available-a', term: 'New phrase' },
      { id: 'owned-b', term: 'Owned too' },
      { id: 'available-b', term: 'Another phrase' }
    ];
    const ownedTerms = new Set([
      normalizeCatalogTerm('Already owned'),
      normalizeCatalogTerm('Owned too')
    ]);

    expect(
      sortWordLibraryEntries(entries, ownedTerms).map(entry => entry.id)
    ).toEqual(['available-a', 'available-b', 'owned-a', 'owned-b']);
  });
});

describe('WordLibraryEntryCard add mode', () => {
  const entry = wordLibraryCatalog[0];

  function render(props: {
    isAdding: boolean;
    isSelected?: boolean;
    isAlreadyAdded?: boolean;
  }) {
    return renderToStaticMarkup(
      <WordLibraryEntryCard
        entry={entry}
        isAdding={props.isAdding}
        isSelected={props.isSelected ?? false}
        isAlreadyAdded={props.isAlreadyAdded ?? false}
        showLevel
        onToggleSelect={() => undefined}
      />
    );
  }

  it('has no selection control outside add mode', () => {
    expect(render({ isAdding: false })).not.toContain('role="checkbox"');
  });

  it('exposes the whole card as one checkbox with its state', () => {
    const idle = render({ isAdding: true });
    const selected = render({ isAdding: true, isSelected: true });

    expect(idle).toContain('role="checkbox"');
    expect(idle).toContain('aria-checked="false"');
    expect(idle).toContain(`Seleccionar ${entry.term}`);
    expect(selected).toContain('aria-checked="true"');
    expect(selected).toContain('data-selected="true"');
  });

  it('keeps owned words visible, locked and not selectable', () => {
    const html = render({ isAdding: true, isAlreadyAdded: true });

    expect(html).not.toContain('role="checkbox"');
    expect(html).toContain('data-existing="true"');
    expect(html).toContain('Ya está en tus tarjetas');
    expect(html).toContain(entry.term);
  });
});
