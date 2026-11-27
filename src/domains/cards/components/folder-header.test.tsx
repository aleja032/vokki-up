import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import type { CardGroup } from '../types';
import { FolderHeader } from './folder-header';

const group: CardGroup = {
  id: 'g1',
  name: 'Trabajo',
  description: '',
  tone: 'indigo'
};

function render(
  options: {
    group?: CardGroup;
    isDeletable?: boolean;
    canManage?: boolean;
    isManaging?: boolean;
  } = {}
) {
  const activeGroup = options.group;
  return renderToStaticMarkup(
    createElement(FolderHeader, {
      group: activeGroup,
      cardCount: activeGroup ? 17 : 46,
      stats: activeGroup
        ? {
            dueCount: 4,
            masteredPercent: 25,
            isDeletable: options.isDeletable ?? true
          }
        : undefined,
      otherGroupNames: ['Viajes'],
      canManage: options.canManage ?? true,
      isManaging: options.isManaging ?? false,
      onShowAll: () => undefined,
      onManage: () => undefined,
      onUpdateGroup: () => undefined,
      onDeleteGroup: () => undefined
    })
  );
}

describe('FolderHeader for a real folder', () => {
  it('shows the folder as the heading with its color chip', () => {
    const html = render({ group });
    expect(html).toContain(
      'id="deck-library-title" title="Trabajo">Trabajo</h2>'
    );
    expect(html).toContain('data-folder-color="indigo"');
    expect(html).toContain('folder-header__chip');
    expect(html).toContain('>Carpeta<');
  });

  it('summarises the folder: cards, due today and mastered', () => {
    expect(render({ group })).toContain(
      '17 tarjetas · 4 para hoy · 25% dominadas'
    );
  });

  it('shows a legacy amber or coral folder in an allowed color', () => {
    expect(render({ group: { ...group, tone: 'amber' } })).toContain(
      'data-folder-color="teal"'
    );
    const coral = render({ group: { ...group, tone: 'coral' } });
    expect(coral).toContain('data-folder-color="lavender"');
    expect(coral).not.toContain('data-folder-color="coral"');
    expect(coral).not.toContain('data-folder-color="amber"');
  });

  it('keeps a short summary for phones: cards and due today', () => {
    expect(render({ group })).toContain('>17 tarjetas · 4 hoy<');
  });

  it('puts Gestionar inside the folder menu for phones', () => {
    expect(render({ group })).toMatch(/role="menuitem"[^>]*>Gestionar</);
  });

  it('has the folder menu at the end of the heading row', () => {
    const html = render({ group });
    expect(html).toContain('aria-label="Opciones de carpeta"');
    expect(html).toContain('>Renombrar<');
    expect(html).toContain('>Cambiar color<');
    expect(html).toContain('>Eliminar carpeta<');
  });

  it('offers a clear way out: a button back to all the folders', () => {
    const html = render({ group });
    expect(html).toContain('aria-label="Ubicación en Mi mazo"');
    expect(html).toMatch(
      /<button[^>]*aria-label="Volver a todas las carpetas"[^>]*>.*Todas las carpetas/
    );
  });

  it('has no add action (the floating button adds to this folder) and keeps Gestionar', () => {
    const html = render({ group });
    expect(html).not.toContain('Agregar tarjeta a esta carpeta');
    expect(html).toContain('aria-label="Opciones de carpeta"');
    expect(html).toContain('>Gestionar<');
  });

  it('disables Gestionar when there is nothing to manage and hides it while managing', () => {
    expect(render({ group, canManage: false })).toMatch(
      /<button[^>]*disabled=""[^>]*>Gestionar</
    );
    expect(render({ group, isManaging: true })).toMatch(
      /<button[^>]*inert=""[^>]*>Gestionar</
    );
  });

  it('blocks the folder delete when it cannot be deleted', () => {
    expect(render({ group, isDeletable: false })).toContain(
      'Elimina sus tarjetas para poder borrar esta carpeta.'
    );
  });
});

describe('FolderHeader for all the folders', () => {
  it('is lighter: the title, the total and no folder tools', () => {
    const html = render();
    expect(html).toContain('>Todas las carpetas</h2>');
    expect(html).toContain('46 tarjetas');
    expect(html).not.toContain('para hoy');
    expect(html).not.toContain('Opciones de carpeta');
    expect(html).not.toContain('Agregar tarjeta a esta carpeta');
    expect(html).not.toContain('Volver a todas las carpetas');
    expect(html).not.toContain('data-folder-color');
  });

  it('keeps Gestionar', () => {
    expect(render()).toContain('>Gestionar<');
  });
});
