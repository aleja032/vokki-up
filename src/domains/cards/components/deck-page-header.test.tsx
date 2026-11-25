import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { DeckPageHeader } from './deck-page-header';

function render(reviewFolder?: { id: string; name: string; dueCount: number }) {
  return renderToStaticMarkup(
    <DeckPageHeader
      dueCount={12}
      reviewFolder={reviewFolder}
      groupCount={3}
      onAddCard={() => undefined}
      totalCards={46}
    />
  );
}

const count = (html: string, text: string) => html.split(text).length - 1;

describe('DeckPageHeader', () => {
  it('shows the title and the real deck summary', () => {
    const html = render();
    expect(html).toContain('<h1>Mi mazo</h1>');
    expect(html).toContain('46 tarjetas · 3 carpetas');
  });

  it('has exactly one primary action: the review', () => {
    const html = render();
    expect(count(html, 'action-pill--primary')).toBe(1);
    expect(html).toMatch(/<a[^>]*action-pill--primary[^>]*>/);
    expect(html).toContain('Repasar 12');
  });

  it('offers the main actions: review, new card menu (with import) and library', () => {
    const html = render();
    expect(html).toContain('href="/review?from=cards"');
    expect(count(html, 'aria-haspopup="menu"')).toBe(1);
    expect(html).toContain('Crear tarjeta');
    expect(html).toContain('href="/import-export?from=cards"');
    expect(html).toContain('Importar archivo');
  });

  it('shows the library as its own action', () => {
    const html = render();
    expect(count(html, 'href="/cards/word-library"')).toBe(1);
    expect(html).toContain('Agregar desde la biblioteca');
  });

  it('places the actions after the title and the summary', () => {
    const html = render();
    expect(html.indexOf('<h1>')).toBeLessThan(html.indexOf('Repasar 12'));
    expect(html.indexOf('46 tarjetas')).toBeLessThan(
      html.indexOf('deck-header__actions')
    );
  });

  it('puts the green tone on the supporting actions only', () => {
    const html = render();
    expect(count(html, 'action-pill--mint')).toBe(2);
    expect(html).not.toMatch(/action-pill--primary[^"]*action-pill--mint/);
  });

  it('reviews the whole deck when no folder is selected', () => {
    const html = render();
    expect(html).toContain('href="/review?from=cards"');
    expect(html).not.toContain('groupId=');
    expect(html).not.toContain('aria-label="Repasar');
  });

  it('follows the selected folder: its link, its due count and its name', () => {
    const html = render({ id: 'g 1', name: 'Trabajo', dueCount: 3 });
    expect(html).toContain('href="/review?groupId=g%201&amp;from=cards"');
    expect(html).toContain('aria-label="Repasar 3 · Trabajo"');
    expect(html).toContain('Repasar 3');
    expect(html).not.toContain('Repasar 12');
    expect(count(html, 'action-pill--primary')).toBe(1);
  });

  it('keeps the review link of a folder with nothing due', () => {
    const html = render({ id: 'g1', name: 'Trabajo', dueCount: 0 });
    expect(html).toContain('href="/review?groupId=g1&amp;from=cards"');
    expect(html).toContain('Repasar 0');
  });

  it('hides the decorative mascot from assistive tech', () => {
    expect(render()).toContain('alt=""');
  });
});
