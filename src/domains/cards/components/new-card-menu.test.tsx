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
