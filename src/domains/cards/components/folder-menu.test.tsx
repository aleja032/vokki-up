import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import type { CardGroup } from '../types';
import { FolderMenu } from './folder-menu';

const group = {
  id: 'g1',
  name: 'Trabajo',
  tone: 'indigo'
} as unknown as CardGroup;

function render(
  options: {
    cardCount?: number;
    isDeletable?: boolean;
    group?: CardGroup;
  } = {}
) {
  return renderToStaticMarkup(
    createElement(FolderMenu, {
      group: options.group ?? group,
      cardCount: options.cardCount ?? 1,
      isDeletable: options.isDeletable ?? true,
      otherGroupNames: ['Viajes'],
      onUpdate: () => undefined,
      onDelete: () => undefined
    })
  );
}

describe('FolderMenu manage item', () => {
  function renderWith(onManage?: () => void) {
    return renderToStaticMarkup(
      createElement(FolderMenu, {
        group,
        cardCount: 1,
        isDeletable: true,
        otherGroupNames: [],
        onUpdate: () => undefined,
        onDelete: () => undefined,
        onManage
      })
    );
  }

  it('lists Gestionar first, for phones, only when it can manage', () => {
    const html = renderWith(() => undefined);
    expect(html).toContain('folder-menu__item--manage');
    expect(html.indexOf('>Gestionar<')).toBeLessThan(
      html.indexOf('>Renombrar<')
    );
    expect(renderWith()).not.toContain('>Gestionar<');
  });
});

describe('FolderMenu', () => {
  it('has a named trigger that opens a menu and starts closed', () => {
    const html = render();
    expect(html).toContain('aria-label="Opciones de carpeta"');
    expect(html).toContain('aria-haspopup="menu"');
    expect(html).toContain('aria-expanded="false"');
  });

  it('lists rename, change color and delete folder', () => {
    const html = render();
    expect(html).toContain('>Renombrar<');
    expect(html).toContain('>Cambiar color<');
    expect(html).toContain('>Eliminar carpeta<');
    expect(html).not.toContain('Elimina sus tarjetas');
  });

  it('opens the edit dialog from rename and recolor, closed until then', () => {
    const html = render();
    expect(html).toContain('>Editar carpeta<');
    expect(html).not.toContain('folder-edit-name');
    expect(html).not.toContain('type="radio"');
  });

  it('keeps rename available for a normal folder', () => {
    const html = render();
    expect(html).not.toMatch(/<button[^>]*disabled[^>]*>Renombrar</);
    expect(html).not.toContain('su nombre no cambia.</span>');
  });

  it('blocks rename for the catch-all Otros, and says why, but keeps recolor', () => {
    const html = render({
      group: { id: 'others', name: 'Otros', description: '', tone: 'gray' }
    });
    expect(html).toMatch(/<button[^>]*disabled[^>]*>Renombrar</);
    expect(html).toContain('su nombre no cambia.');
    expect(html).not.toMatch(/<button[^>]*disabled[^>]*>Cambiar color</);
  });

  it('blocks the delete and says why when the folder cannot be deleted', () => {
    const html = render({ isDeletable: false });
    expect(html).toMatch(/<button[^>]*disabled[^>]*>Eliminar carpeta</);
    expect(html).toContain(
      'Elimina sus tarjetas para poder borrar esta carpeta.'
    );
  });

  it('renders the shared confirm dialog and no inline confirm', () => {
    const html = render();
    expect(html).toContain('class="confirm-dialog"');
    expect(html).toContain('role="alertdialog"');
    expect(html).toContain('>Eliminar grupo<');
    expect(html).toContain(
      'Se eliminará “Trabajo”. Su 1 tarjeta pasará a “Otros” y conserva su progreso.'
    );
    expect(html).not.toContain('deck-confirm');
  });

  it('says there is nothing to move when the folder is empty', () => {
    expect(render({ cardCount: 0 })).toContain(
      'Se eliminará “Trabajo”. El grupo no tiene tarjetas.'
    );
  });
});
