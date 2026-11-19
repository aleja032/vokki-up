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

function render(
  tiles: Parameters<typeof CardGroupList>[0]['tiles'],
  activeGroupId = 'all'
) {
  return renderToStaticMarkup(
    createElement(CardGroupList, {
      tiles,
      totalCards: 46,
      totalDue: 12,
      activeGroupId,
      onSelectAll: () => undefined,
      onOpenGroup: () => undefined,
      onAddGroup: () => undefined
    })
  );
}

describe('CardGroupList folders', () => {
  it('shows the all folder with the total and marks it pressed', () => {
    const html = render([]);
    expect(html).toContain('>Todas<');
    expect(html).toContain('>46<');
    expect(html).toContain('Todo tu mazo');
    expect(html).toContain('aria-pressed="true"');
  });

  it('shows one folder per group with count, name, description and tone', () => {
    const html = render([{ group, cardCount: 17, dueCount: 3 }]);
    expect(html).toContain('>Trabajo<');
    expect(html).toContain('>17<');
    expect(html).toContain('Reuniones y correos');
    expect(html).toContain('data-tone="coral"');
    expect(html).toContain('aria-label="Trabajo · 17 tarjetas · 3 hoy"');
    expect(html.split('aria-pressed').length - 1).toBe(1);
  });

  it('keeps a visible control to create a group', () => {
    const html = render([]);
    expect(html).toContain('folder-tile--add');
    expect(html).toContain('Nuevo grupo');
  });

  it('no longer carries the library link (it lives in the page header)', () => {
    expect(render([])).not.toContain('word-library');
  });
});
