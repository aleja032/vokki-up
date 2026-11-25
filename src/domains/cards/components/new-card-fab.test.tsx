import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { NewCardFab } from './new-card-fab';

const html = renderToStaticMarkup(<NewCardFab onCreate={() => undefined} />);

describe('NewCardFab', () => {
  it('is one floating button named Agregar, wired to a closed menu', () => {
    expect(html).toContain('new-card-fab');
    expect(html).toContain('aria-label="Agregar"');
    expect(html).toContain('aria-haspopup="menu"');
    expect(html).toContain('aria-expanded="false"');
  });

  it('offers manual, import and library as the three ways to add', () => {
    expect(html.match(/role="menuitem"/g)).toHaveLength(3);
    expect(html).toContain('Crear tarjeta');
    expect(html).toContain('href="/import-export?from=cards"');
    expect(html).toContain('href="/cards/word-library"');
  });
});
