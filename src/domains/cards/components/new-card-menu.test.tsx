import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { NewCardMenu } from './new-card-menu';

const html = renderToStaticMarkup(<NewCardMenu onCreate={() => undefined} />);

describe('NewCardMenu', () => {
  it('renders a closed menu button wired to its list', () => {
    expect(html).toContain('aria-haspopup="menu"');
    expect(html).toContain('aria-expanded="false"');
    expect(html).toContain('aria-controls="new-card-menu"');
    expect(html).toContain('id="new-card-menu"');
    expect(html).toMatch(/role="menu"[^>]*hidden|hidden=""[^>]*role="menu"/);
  });

  it('names the trigger Agregar with an icon and a hover tooltip, no visible label', () => {
    expect(html).toContain('aria-label="Agregar"');
    expect(html).toContain('new-card-menu__trigger');
    expect(html).toContain('<svg');
    expect(html).toMatch(
      /<span aria-hidden="true" class="new-card-menu__tooltip">Agregar<\/span>/
    );
    expect(html).not.toContain('new-card-menu__label');
  });

  it('lists manual, file and library as the three ways to add cards', () => {
    expect(html.match(/role="menuitem"/g)).toHaveLength(3);
    expect(html).toContain('Crear tarjeta');
    expect(html).toContain('href="/import-export?from=cards"');
    expect(html).toContain('Importar archivo');
    expect(html).toContain('href="/cards/word-library"');
    expect(html).toContain('Desde la biblioteca');
  });

  it('starts with the attention ring class', () => {
    expect(html).toContain('new-card-menu--pulse');
  });
});

describe('floating button motion CSS', () => {
  const read = (name: string) =>
    readFileSync(
      join(process.cwd(), 'src/domains/cards/components', name),
      'utf8'
    );
  const css = read('new-card-menu.css');
  const fabCss = read('new-card-fab.css');

  it('animates the ring, the menu and its items and the entrance', () => {
    expect(css).toContain('@keyframes new-card-ring');
    expect(css).toContain('@keyframes new-card-menu-in');
    expect(css).toContain('@keyframes new-card-item-in');
    expect(fabCss).toContain('@keyframes new-card-fab-pop');
  });

  it('switches every animation off under prefers-reduced-motion', () => {
    expect(css).toMatch(/prefers-reduced-motion: reduce/);
    expect(fabCss).toMatch(/prefers-reduced-motion: reduce/);
  });
});
