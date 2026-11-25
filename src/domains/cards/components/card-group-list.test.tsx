import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import type { CardGroup } from '../types';
import { CardGroupList } from './card-group-list';

const group = {
  id: 'g1',
  name: 'Trabajo',
  description: 'Reuniones y correos',
  tone: 'coral'
} as CardGroup;
const travel = { id: 'g2', name: 'Viajes', tone: 'blue' } as CardGroup;

function render(
  tiles: Parameters<typeof CardGroupList>[0]['tiles'],
  options: { activeGroupId?: string; searchText?: string } = {}
) {
  return renderToStaticMarkup(
    createElement(CardGroupList, {
      tiles,
      totalCards: 46,
      totalDue: 12,
      activeGroupId: options.activeGroupId ?? 'all',
      searchText: options.searchText ?? '',
      onSearchChange: () => undefined,
      onSelectGroup: () => undefined,
      onAddGroup: () => undefined
    })
  );
}

describe('CardGroupList folders', () => {
  it('shows the title with the folder count and the all folder pressed', () => {
    const html = render([{ group, cardCount: 17, dueCount: 3 }]);
    expect(html).toContain('>Carpetas<');
    expect(html).toContain('>Todas<');
    expect(html).toContain('>46<');
    expect(html.match(/aria-pressed="true"/g)).toHaveLength(1);
  });

  it('shows one folder per group with its count and a full accessible name', () => {
    const html = render([{ group, cardCount: 17, dueCount: 3 }]);
    expect(html).toContain('>Trabajo<');
    expect(html).toContain('>17<');
    expect(html).toContain('aria-label="Trabajo · 17 tarjetas · 3 hoy"');
  });

  it('marks the active group instead of the all folder', () => {
    const html = render([{ group, cardCount: 17, dueCount: 3 }], {
      activeGroupId: 'g1'
    });
    expect(html.match(/aria-pressed="true"/g)).toHaveLength(1);
    expect(html).toMatch(/aria-label="Todas[^"]*" aria-pressed="false"/);
  });

  it('narrows the folders by name but always keeps the all folder', () => {
    const html = render(
      [
        { group, cardCount: 17, dueCount: 3 },
        { group: travel, cardCount: 9, dueCount: 0 }
      ],
      { searchText: 'viaj' }
    );
    expect(html).toContain('>Viajes<');
    expect(html).not.toContain('>Trabajo<');
    expect(html).toContain('>Todas<');
  });

  it('explains when no folder matches the search', () => {
    const html = render([{ group, cardCount: 17, dueCount: 3 }], {
      searchText: 'zzz'
    });
    expect(html).toContain('No hay carpetas con ese nombre.');
  });

  it('gives every folder its color and leaves Todas neutral', () => {
    const html = render([
      { group, cardCount: 17, dueCount: 3 },
      { group: travel, cardCount: 9, dueCount: 0 }
    ]);
    // legacy coral is shown as lavender, never as coral or amber
    expect(html).toContain('data-folder-color="lavender"');
    expect(html).toContain('data-folder-color="blue"');
    expect(html).not.toContain('data-folder-color="coral"');
    expect(html).not.toContain('data-folder-color="amber"');
    expect(html.match(/data-folder-color=/g)).toHaveLength(2);
  });

  it('shows a seed folder stored as amber in an allowed color', () => {
    const html = render([
      {
        group: { ...travel, tone: 'amber' },
        cardCount: 9,
        dueCount: 0
      }
    ]);
    expect(html).toContain('data-folder-color="teal"');
    expect(html).not.toContain('amber');
  });

  it('keeps a visible control to create a folder', () => {
    expect(render([])).toContain('Nueva carpeta');
  });

  it('points to the Worlds once, as the hint of where new words come from', () => {
    const html = render([]);
    expect(html).toContain('folder-list__hint');
    expect(html.split('href="/cards/word-library"').length - 1).toBe(1);
  });
});
