import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import type { CardGroup } from '../types';
import { FolderEditDialog } from './folder-edit-dialog';

const work: CardGroup = {
  id: 'work',
  name: 'Trabajo',
  description: '',
  tone: 'indigo'
};

function render(
  options: {
    group?: CardGroup;
    open?: boolean;
    focus?: 'name' | 'color';
  } = {}
) {
  return renderToStaticMarkup(
    createElement(FolderEditDialog, {
      group: options.group ?? work,
      otherGroupNames: ['Viajes'],
      open: options.open ?? true,
      focus: options.focus ?? 'name',
      onSave: () => undefined,
      onClose: () => undefined
    })
  );
}

describe('FolderEditDialog', () => {
  it('is one dialog titled "Editar carpeta" with a labelled name field', () => {
    const html = render();
    expect(html).toContain('role="dialog"');
    expect(html).toContain('>Editar carpeta<');
    expect(html).toMatch(
      /<label[^>]*for="folder-edit-name"[^>]*>Nombre de la carpeta/
    );
    expect(html).toContain('id="folder-edit-name"');
    expect(html).toContain('value="Trabajo"');
  });

  it('offers the six folder colors as a named radio group, current one checked', () => {
    const html = render();
    expect(html).toContain('>Color de la carpeta<');
    expect(html.match(/type="radio"/g)).toHaveLength(6);
    for (const name of [
      'Índigo',
      'Lavanda',
      'Azul',
      'Turquesa',
      'Verde',
      'Gris'
    ])
      expect(html).toContain(`>${name}<`);
    expect(html).not.toContain('>Ámbar<');
    expect(html).not.toContain('>Coral<');
    expect(html).toMatch(
      /value="indigo"[^>]*checked=""|checked=""[^>]*value="indigo"/
    );
  });

  it('shows a legacy amber or coral folder with the color it is displayed in', () => {
    const html = render({ group: { ...work, tone: 'coral' } });
    expect(html).toMatch(
      /value="lavender"[^>]*checked=""|checked=""[^>]*value="lavender"/
    );
  });

  it('focuses the name when renaming and the chosen color when recoloring', () => {
    const rename = render({ focus: 'name' });
    expect(rename).toMatch(
      /id="folder-edit-name"[^>]*data-autofocus|data-autofocus[^>]*id="folder-edit-name"/
    );
    expect(rename.match(/data-autofocus/g)).toHaveLength(1);

    const recolor = render({ focus: 'color' });
    expect(recolor.match(/data-autofocus/g)).toHaveLength(1);
    expect(recolor).toMatch(
      /value="indigo"[^>]*data-autofocus|data-autofocus[^>]*value="indigo"/
    );
  });

  it('has a save button that starts disabled (nothing changed) and a cancel button', () => {
    const html = render();
    expect(html).toMatch(
      /<button(?=[^>]*type="submit")(?=[^>]*disabled="")[^>]*>Guardar</
    );
    expect(html).toContain('>Cancelar<');
  });

  it('locks the name of "Otros" and says why, but keeps the colors', () => {
    const html = render({
      group: { id: 'others', name: 'Otros', description: '', tone: 'gray' }
    });
    expect(html).toMatch(/id="folder-edit-name"[^>]*readOnly=""|readonly=""/i);
    expect(html).toContain('su nombre no cambia');
    expect(html.match(/type="radio"/g)).toHaveLength(6);
  });

  it('renders no form while closed', () => {
    const html = render({ open: false });
    expect(html).toContain('>Editar carpeta<');
    expect(html).not.toContain('folder-edit-name');
  });
});
