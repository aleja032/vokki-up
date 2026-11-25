import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import type { CardGroup } from '../types';
import { FolderChipRow } from './folder-chip-row';

const work = { id: 'g1', name: 'Trabajo', tone: 'coral' } as CardGroup;
const travel = { id: 'g2', name: 'Viajes', tone: 'blue' } as CardGroup;

function render(activeGroupId = 'all') {
  return renderToStaticMarkup(
    createElement(FolderChipRow, {
      tiles: [
        { group: work, cardCount: 17, dueCount: 3 },
        { group: travel, cardCount: 9, dueCount: 0 }
      ],
      totalCards: 46,
      totalDue: 12,
      activeGroupId,
      onSelectGroup: () => undefined,
      onAddGroup: () => undefined
    })
  );
}

describe('FolderChipRow', () => {
  it('keeps a visually hidden heading for the folders', () => {
    expect(render()).toMatch(/<h2 class="sr-only"[^>]*>Carpetas<\/h2>/);
  });

  it('is one named navigation with Todas first and then each folder', () => {
    const html = render();
    expect(html).toContain('aria-label="Carpetas de tarjetas"');
    expect(html.indexOf('>Todas<')).toBeLessThan(html.indexOf('>Trabajo<'));
    expect(html.indexOf('>Trabajo<')).toBeLessThan(html.indexOf('>Viajes<'));
    expect(html).toContain('aria-label="Trabajo · 17 tarjetas · 3 hoy"');
  });

  it('presses exactly the selected chip', () => {
    expect(render().match(/aria-pressed="true"/g)).toHaveLength(1);
    const inFolder = render('g2');
    expect(inFolder.match(/aria-pressed="true"/g)).toHaveLength(1);
    expect(inFolder).toMatch(/aria-label="Viajes[^"]*" aria-pressed="true"/);
  });

  it('gives every folder its color and shows its count', () => {
    const html = render();
    expect(html).toContain('data-folder-color="lavender"');
    expect(html).toContain('data-folder-color="blue"');
    expect(html).not.toContain('data-folder-color="coral"');
    for (const total of ['>46<', '>17<', '>9<']) expect(html).toContain(total);
  });

  it('ends with a chip that starts a new folder', () => {
    const html = render();
    expect(html).toContain('aria-label="Nueva carpeta"');
    expect(html.indexOf('>Viajes<')).toBeLessThan(
      html.indexOf('folder-chips__add')
    );
    expect(html).toContain('>Carpeta<');
  });
});
