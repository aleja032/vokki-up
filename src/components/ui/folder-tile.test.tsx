import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { FolderTile } from './folder-tile';

describe('FolderTile', () => {
  it('shows count, title and hint inside a button of its tone', () => {
    const html = renderToStaticMarkup(
      <FolderTile
        count={17}
        icon={<svg />}
        onClick={() => undefined}
        subtitle="Reuniones y correos"
        title="Trabajo"
        tone="coral"
      />
    );

    expect(html).toContain('<button');
    expect(html).toContain('data-tone="coral"');
    expect(html).toContain('>17<');
    expect(html).toContain('>Trabajo<');
    expect(html).toContain('Reuniones y correos');
  });

  it('exposes the pressed state only when it is given', () => {
    const render = (pressed?: boolean) =>
      renderToStaticMarkup(
        <FolderTile
          count={1}
          icon={<svg />}
          onClick={() => undefined}
          pressed={pressed}
          title="Todas"
        />
      );

    expect(render(true)).toContain('aria-pressed="true"');
    expect(render()).not.toContain('aria-pressed');
  });

  it('renders the dashed add variant with only a label and an icon', () => {
    const html = renderToStaticMarkup(
      <FolderTile
        icon={<svg data-plus />}
        onClick={() => undefined}
        title="Nuevo grupo"
        variant="add"
      />
    );

    expect(html).toContain('folder-tile--add');
    expect(html).toContain('Nuevo grupo');
    expect(html).not.toContain('folder-tile__count');
  });
});
