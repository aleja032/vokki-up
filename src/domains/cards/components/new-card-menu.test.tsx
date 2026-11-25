import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { NewCardMenu } from './new-card-menu';

function render() {
  return renderToStaticMarkup(<NewCardMenu onCreate={() => undefined} />);
}

describe('NewCardMenu', () => {
  it('renders a closed menu button wired to its list', () => {
    const html = render();

    expect(html).toContain('aria-haspopup="menu"');
    expect(html).toContain('aria-expanded="false"');
    expect(html).toContain('aria-controls="new-card-menu"');
    expect(html).toContain('id="new-card-menu"');
    expect(html).toMatch(/role="menu"[^>]*hidden|hidden=""[^>]*role="menu"/);
  });

  it('lists the manual and the file ways to add cards as menu items', () => {
    const html = render();

    expect(html.match(/role="menuitem"/g)).toHaveLength(2);
    expect(html).toContain('Crear tarjeta');
    expect(html).toContain('href="/import-export?from=cards"');
    expect(html).toContain('Importar archivo');
  });

  it('leaves the library to its own action of the page header', () => {
    expect(render()).not.toContain('href="/cards/word-library"');
  });
});

describe('NewCardMenu floating variant', () => {
  const html = renderToStaticMarkup(
    <NewCardMenu onCreate={() => undefined} variant="fab" />
  );

  it('is an icon-only trigger named Agregar with its own menu id', () => {
    expect(html).toContain('new-card-menu__trigger--fab');
    expect(html).toContain('aria-label="Agregar"');
    expect(html).toContain('id="new-card-menu-fab"');
    expect(html).toContain('aria-controls="new-card-menu-fab"');
    expect(html).not.toContain('new-card-menu__label');
  });

  it('adds the library as a third way to add cards', () => {
    expect(html.match(/role="menuitem"/g)).toHaveLength(3);
    expect(html).toContain('href="/cards/word-library"');
    expect(html).toContain('Desde la biblioteca');
  });
});
