import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { FolderList, type FolderListItem } from './folder-list';

const items: FolderListItem[] = [
  {
    id: 'all',
    label: 'Todas',
    count: 46,
    pressed: true,
    onSelect: () => undefined
  },
  {
    id: 'work',
    label: 'Trabajo',
    count: 17,
    pressed: false,
    ariaLabel: 'Trabajo · 17 tarjetas',
    countLabel: '17 tarjetas',
    dueLabel: '4 hoy',
    color: 'teal',
    onSelect: () => undefined
  }
];

function render(list: readonly FolderListItem[] = items, expandable = false) {
  return renderToStaticMarkup(
    <FolderList
      addLabel="Nueva carpeta"
      collapseLabel={expandable ? 'Ver menos' : undefined}
      expandLabel={expandable ? 'Ver las 12' : undefined}
      emptyLabel="Sin resultados"
      items={list}
      listLabel="Lista de carpetas"
      onAdd={() => undefined}
      onSearchChange={() => undefined}
      searchLabel="Buscar carpeta"
      searchValue=""
      title="Carpetas"
      total={12}
    />
  );
}

describe('FolderList', () => {
  it('shows the title with the folder total and a labelled search', () => {
    const html = render();

    expect(html).toContain('>Carpetas<');
    expect(html).toContain('>12<');
    expect(html).toContain('Buscar carpeta');
    expect(html).toContain('type="search"');
  });

  it('lists each folder with its count and marks only the selected one', () => {
    const html = render();

    expect(html).toContain('>Trabajo<');
    expect(html).toContain('>17<');
    expect(html).toContain('aria-label="Trabajo · 17 tarjetas"');
    expect(html.match(/aria-pressed="true"/g)).toHaveLength(1);
    expect(html.match(/aria-pressed="false"/g)).toHaveLength(1);
  });

  it('shows the long count and the due dot of a folder for the phone cards', () => {
    const html = render();

    expect(html).toContain('>17 tarjetas<');
    expect(html).toContain('>4 hoy<');
    expect(html).toContain('folder-list__dot');
    // "Todas" has no due label, so only one due block is rendered.
    expect(html.match(/folder-list__due/g)).toHaveLength(1);
  });

  it('marks each folder with its color and leaves the all folder neutral', () => {
    const html = render([
      ...items,
      { ...items[1], id: 'trip', label: 'Viajes', color: 'lavender' }
    ]);

    expect(html.match(/data-folder-color="/g)).toHaveLength(2);
    expect(html).toContain('data-folder-color="teal"');
    expect(html).toContain('data-folder-color="lavender"');
    // one color chip behind the icon of every folder, plain for "Todas"
    expect(
      html.match(/<span aria-hidden="true" class="folder-list__chip/g)
    ).toHaveLength(3);
    expect(html.match(/folder-list__chip--colored/g)).toHaveLength(2);
  });

  it('offers the link that expands the phone list only when it is given', () => {
    expect(render()).not.toContain('folder-list__toggle');

    const html = render(items, true);
    expect(html).toContain('>Ver las 12<');
    expect(html).toContain('aria-expanded="false"');
    expect(html).toContain('data-expanded="false"');
  });

  it('keeps a labelled button to add a folder', () => {
    expect(render()).toContain('Nueva carpeta');
  });

  it('explains an empty result', () => {
    expect(render([])).toContain('Sin resultados');
  });
});
