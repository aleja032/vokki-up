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
    isDeletable?: boolean;
  } = {}
) {
  return renderToStaticMarkup(
    createElement(CardsLibrary, {
      cards,
      schedules: {},
      now: new Date('2026-01-01T00:00:00Z'),
      activeGroup: options.activeGroup,
      categories: ['Todas'],
      activeCategory: 'Todas',
      activeStatus: options.activeStatus ?? 'all',
      statusCounts: { all: 46, due: 12, week: 19, safe: 15 },
      searchText: options.searchText ?? '',
      canDeleteCards: true,
      onSearchChange: () => undefined,
      onCategoryChange: () => undefined,
      onStatusChange: () => undefined,
      onDeleteCards: () => undefined,
      onAddCard: () => undefined,
      activeGroupStats: options.activeGroup
        ? {
            dueCount: 4,
            masteredPercent: 25,
            isDeletable: options.isDeletable ?? true
          }
        : undefined,
      onDeleteGroup: () => undefined,
      onShowAll: () => undefined,
      onEditCard: () => undefined
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
    expect(html).toContain('aria-label="Filtrar por próximo repaso"');
    for (const label of ['Todas', 'Hoy', 'Esta semana', 'Seguras'])
      expect(html).toContain(label);
    for (const total of ['>46<', '>12<', '>19<', '>15<'])
      expect(html).toContain(total);
    expect(html.match(/aria-pressed="true"/g)).toHaveLength(1);
    expect(html).toMatch(/aria-pressed="true"[^>]*><span[^>]*><\/span>Hoy/);
  });

  it('shows a breadcrumb: Mi mazo as the way back, then the open folder', () => {
    const html = render([card], { activeGroup: group });
    expect(html).toContain('aria-label="Ubicación en Mi mazo"');
    expect(html).toContain('>Carpeta<');
    expect(html).toContain(
      'id="deck-library-title" title="Trabajo">Trabajo</h2>'
    );
    expect(html).toMatch(/<button[^>]*deck-library__crumb-root[^>]*>.*Mi mazo/);
    expect(html).not.toContain('Abrir carpeta');
  });

  it('shows the whole deck as the current place without a way back', () => {
    const html = render([card]);
    expect(html).toContain('Todas las carpetas');
    expect(html).not.toContain('Abrir carpeta');
    expect(html).not.toMatch(/<button[^>]*deck-library__crumb-root/);
  });

  it('shows the visible range and a numbered pager when there are many cards', () => {
    const many = Array.from({ length: 30 }, (_, index) => ({
      ...card,
      id: `c${index}`
    }));
    const html = render(many);
    expect(html).toContain('Mostrando 1–12 de 30 tarjetas');
    expect(html).toContain('aria-current="page"');
    expect(html).toContain('aria-label="Página 3"');
  });
});

describe('CardsLibrary folder tools', () => {
  it('shows the folder menu only for a real folder', () => {
    const inFolder = render([card], { activeGroup: group });
    expect(inFolder).toContain('aria-label="Opciones de carpeta"');
    expect(inFolder).toContain('>Renombrar<');
    expect(inFolder).toContain('>Cambiar color<');
    expect(inFolder).toContain('>Eliminar carpeta<');
    const whole = render([card]);
    expect(whole).not.toContain('Opciones de carpeta');
    expect(whole).not.toContain('Renombrar');
  });

  it('keeps Gestionar next to the folder menu', () => {
    const html = render([card], { activeGroup: group });
    expect(html).toContain('>Gestionar<');
  });

  it('shows the folder quick stats as chips', () => {
    const html = render([card], { activeGroup: group });
    expect(html).toContain('4 para hoy');
    expect(html).toContain('25% dominadas');
    expect(render([card])).not.toContain('dominadas');
  });

  it('blocks the folder delete when the folder cannot be deleted', () => {
    const html = render([card], { activeGroup: group, isDeletable: false });
    expect(html).toContain(
      'Elimina sus tarjetas para poder borrar esta carpeta.'
    );
  });

  it('shows the empty state with its add actions for an empty folder', () => {
    const html = render([], { activeGroup: group });
    expect(html).toContain('Este grupo todavía está vacío');
    expect(count(html, '>Añadir tarjeta<')).toBe(1);
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
