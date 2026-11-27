import { readFileSync } from 'node:fs';
import { join } from 'node:path';
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

  it('is the same round button at every width: icon plus a decorative tooltip', () => {
    expect(html).toContain('<svg');
    expect(html).toContain('new-card-menu__tooltip');
    expect(html).not.toContain('new-card-menu__label');
  });

  it('has a decorative Noma beside the button: aria-hidden, empty alt, no pointer events class contract', () => {
    expect(html).toMatch(
      /<span aria-hidden="true" class="new-card-fab__noma">/
    );
    expect(html).toContain('alt=""');
    expect(html).toContain('noma-curious.png');
    const css = readFileSync(
      join(process.cwd(), 'src/domains/cards/components/new-card-fab.css'),
      'utf8'
    );
    expect(css).toMatch(/\.new-card-fab__noma \{[^}]*pointer-events-none/);
  });

  it('is not hidden on any width', () => {
    expect(html).not.toContain('hidden"');
    expect(html).not.toMatch(/class="[^"]*new-card-fab[^"]*hidden/);
  });

  it('offers manual, import and library as the three ways to add', () => {
    expect(html.match(/role="menuitem"/g)).toHaveLength(3);
    expect(html).toContain('Crear tarjeta');
    expect(html).toContain('href="/import-export?from=cards"');
    expect(html).toContain('href="/cards/word-library"');
  });
});
