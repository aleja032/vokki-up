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
    onSelect: () => undefined
  }
];

function render(list: readonly FolderListItem[] = items) {
  return renderToStaticMarkup(
    <FolderList
      addLabel="Nueva carpeta"
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

  it('keeps a labelled button to add a folder', () => {
    expect(render()).toContain('Nueva carpeta');
  });

  it('explains an empty result', () => {
    expect(render([])).toContain('Sin resultados');
  });
});
