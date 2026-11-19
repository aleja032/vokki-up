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

  it('lists both ways to add cards as menu items', () => {
    const html = render();

    expect(html.match(/role="menuitem"/g)).toHaveLength(2);
    expect(html).toContain('Crear tarjeta');
    expect(html).toContain('href="/cards/word-library"');
    expect(html).toContain('Agregar desde la biblioteca');
  });
});
