import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import type { CardStatusFilter } from '../card-status';
import type { CardGroup, VocabularyCard } from '../types';
import { CardsLibrary } from './cards-library';

const group = { id: 'g1', name: 'Trabajo', tone: 'indigo' } as CardGroup;
const card = {
  id: 'c1',
  term: 'deadline',
  meaning: 'fecha limite',
  groupId: 'g1',
  tags: []
} as unknown as VocabularyCard;

function render(
  cards: VocabularyCard[],
  options: {
    activeGroup?: CardGroup;
    searchText?: string;
    activeStatus?: CardStatusFilter;
  } = {}
) {
  return renderToStaticMarkup(
    createElement(CardsLibrary, {
      cards,
      groups: [group],
      schedules: {},
      now: new Date('2026-01-01T00:00:00Z'),
      activeGroup: options.activeGroup,
      categories: ['Todas'],
      activeCategory: 'Todas',
      activeStatus: options.activeStatus ?? 'all',
      statusCounts: { all: 46, due: 12, learning: 11, mastered: 23 },
      searchText: options.searchText ?? '',
      canDeleteCards: true,
      onSearchChange: () => undefined,
      onCategoryChange: () => undefined,
      onStatusChange: () => undefined,
      onDeleteCards: () => undefined,
      onAddCard: () => undefined
    })
  );
}

const count = (html: string, text: string) => html.split(text).length - 1;

describe('CardsLibrary toolbar', () => {
  it('renders the search field, the type select and the manage button', () => {
    const html = render([card]);
    expect(html).toContain('id="deck-search-input"');
    expect(html).toContain('id="deck-type-select"');
    expect(html).toContain('>Tipo<');
    expect(html).toContain('>Gestionar<');
  });

  it('shows the status filter with a count per status and one pressed', () => {
    const html = render([card], { activeStatus: 'due' });
    expect(html).toContain('aria-label="Filtrar por estado"');
    for (const label of ['Todas', 'Para hoy', 'En curso', 'Dominadas'])
      expect(html).toContain(label);
    for (const total of ['>46<', '>12<', '>11<', '>23<'])
      expect(html).toContain(total);
    expect(html.match(/aria-pressed="true"/g)).toHaveLength(1);
    expect(html).toMatch(
      /aria-pressed="true"[^>]*><span[^>]*><\/span>Para hoy/
    );
  });
});

describe('CardsLibrary group add actions', () => {
  it('offers the primary add action and the library link for an empty group', () => {
    const html = render([], { activeGroup: group });
    expect(count(html, '>Añadir tarjeta<')).toBe(1);
    expect(count(html, 'href="/cards/word-library"')).toBe(1);
    expect(html).not.toContain('No hay tarjetas con ese filtro.');
  });

  it('offers Añadir and the library link for a group with cards', () => {
    const html = render([card], { activeGroup: group });
    expect(count(html, '>Añadir<')).toBe(1);
    expect(count(html, '>Añadir tarjeta<')).toBe(0);
    expect(count(html, 'href="/cards/word-library"')).toBe(1);
  });

  it('keeps the filter message, without CTAs, when a search empties a group', () => {
    const html = render([], { activeGroup: group, searchText: 'zzz' });
    expect(html).toContain('No hay tarjetas con ese filtro.');
    expect(html).not.toContain('word-library');
  });

  it('hides the group CTAs while a status filter is active', () => {
    const html = render([], { activeGroup: group, activeStatus: 'due' });
    expect(html).toContain('No hay tarjetas con ese filtro.');
    expect(html).not.toContain('word-library');
  });

  it('adds no CTAs without an active group', () => {
    const html = render([]);
    expect(html).toContain('No hay tarjetas con ese filtro.');
    expect(html).not.toContain('word-library');
  });
});
