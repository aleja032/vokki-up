import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { DeckPageHeader } from './deck-page-header';

function render() {
  return renderToStaticMarkup(
    <DeckPageHeader
      dueCount={12}
      masteredCount={23}
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
    expect(html).toContain('46 tarjetas · 12 para repasar hoy · 23 dominadas');
  });

  it('keeps one review link with the due count and one new-card button', () => {
    const html = render();
    expect(count(html, 'href="/review?from=cards"')).toBe(1);
    expect(html).toContain('Repasar 12');
    expect(html).toContain('>Nueva tarjeta<');
  });

  it('keeps exactly one word library link with its full accessible name', () => {
    const html = render();
    expect(count(html, 'href="/cards/word-library"')).toBe(1);
    expect(html).toContain('aria-label="Agregar desde la biblioteca"');
  });

  it('hides the decorative mascot from assistive tech', () => {
    expect(render()).toContain('alt=""');
  });
});
