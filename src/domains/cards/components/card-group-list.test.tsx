import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { CardGroupList } from './card-group-list';

function render(tiles: Parameters<typeof CardGroupList>[0]['tiles']) {
  return renderToStaticMarkup(
    createElement(CardGroupList, {
      tiles,
      totalCards: 0,
      totalDue: 0,
      activeGroupId: 'all',
      onSelectAll: () => undefined,
      onOpenGroup: () => undefined,
      onAddGroup: () => undefined
    })
  );
}

describe('CardGroupList library action', () => {
  it('links to the word library once next to the add group control', () => {
    const html = render([]);
    expect(html.split('href="/cards/word-library"').length - 1).toBe(1);
    expect(html).toContain('Agregar desde la biblioteca');
  });
});
