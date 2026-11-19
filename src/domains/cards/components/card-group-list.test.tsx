import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import type { CardGroup } from '../types';
import { CardGroupList } from './card-group-list';

const group = { id: 'g1', name: 'Trabajo', tone: 'indigo' } as CardGroup;

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

describe('CardGroupList chips', () => {
  it('shows the all chip with the total and marks it pressed', () => {
    const html = render([]);
    expect(html).toContain('Todas · 46');
    expect(html).toContain('aria-pressed="true"');
  });

  it('shows one chip per group with its card count and no pressed state', () => {
    const html = render([{ group, cardCount: 17, dueCount: 3 }]);
    expect(html).toContain('Trabajo · 17');
    expect(html).toContain('Trabajo · 17 tarjetas · 3 hoy');
    expect(html.split('aria-pressed').length - 1).toBe(1);
  });

  it('keeps a labelled control to create a group', () => {
    const html = render([]);
    expect(html).toContain('aria-label="Nuevo grupo"');
  });

  it('no longer carries the library link (it lives in the page header)', () => {
    expect(render([])).not.toContain('word-library');
  });
});
