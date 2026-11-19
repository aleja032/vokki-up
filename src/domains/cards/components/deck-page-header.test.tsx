import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { DeckPageHeader } from './deck-page-header';

function render() {
  return renderToStaticMarkup(
    <DeckPageHeader
      dueCount={12}
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

  it('keeps one review link with the due count', () => {
    const html = render();
    expect(count(html, 'href="/review?from=cards"')).toBe(1);
    expect(html).toContain('Repasar 12');
  });

  it('offers new card actions through one menu button', () => {
    const html = render();
    expect(count(html, 'aria-haspopup="menu"')).toBe(1);
    expect(html).toContain('aria-label="Nueva tarjeta"');
    expect(html).toContain('Crear tarjeta');
  });

  it('keeps exactly one word library link with its full accessible name', () => {
    const html = render();
    expect(count(html, 'href="/cards/word-library"')).toBe(1);
    expect(html).toContain('Agregar desde la biblioteca');
  });

  it('hides the decorative mascot from assistive tech', () => {
    expect(render()).toContain('alt=""');
  });
});
