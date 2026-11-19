import { createElement, type ReactNode } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
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
    groupFilters?: ReactNode;
  } = {}
) {
  return renderToStaticMarkup(
    createElement(CardsLibrary, {
      groupFilters: options.groupFilters,
      cards,
      groups: [group],
      schedules: {},
      now: new Date('2026-01-01T00:00:00Z'),
      activeGroup: options.activeGroup,
      categories: ['Todas'],
      activeCategory: 'Todas',
      searchText: options.searchText ?? '',
      canDeleteCards: true,
      onSearchChange: () => undefined,
      onCategoryChange: () => undefined,
      onDeleteCards: () => undefined,
      onAddCard: () => undefined
    })
  );
}

const count = (html: string, text: string) => html.split(text).length - 1;

describe('CardsLibrary toolbar', () => {
  it('renders the group filters slot next to the search and category chips', () => {
    const html = render([card], {
      groupFilters: createElement('div', { 'data-slot': 'groups' })
    });
    expect(html).toContain('data-slot="groups"');
    expect(html).toContain('id="deck-search-input"');
    expect(html).toContain('aria-pressed="true"');
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

  it('adds no CTAs without an active group', () => {
    const html = render([]);
    expect(html).toContain('No hay tarjetas con ese filtro.');
    expect(html).not.toContain('word-library');
  });
});
