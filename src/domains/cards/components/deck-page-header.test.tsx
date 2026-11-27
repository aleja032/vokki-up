import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { DeckPageHeader } from './deck-page-header';

function render(reviewFolder?: { id: string; name: string; dueCount: number }) {
  return renderToStaticMarkup(
    <DeckPageHeader
      dueCount={12}
      reviewFolder={reviewFolder}
      groupCount={3}
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

  it('has one primary action per layout: the header review and the phone banner', () => {
    const html = render();
    expect(count(html, 'action-pill--primary')).toBe(2);
    expect(html).toContain('review-banner');
    expect(html).toMatch(/<a[^>]*action-pill--primary[^>]*>/);
    expect(html).toContain('Repasar 12 tarjetas');
  });

  it('has one desktop CTA: the review, with no add actions (the floating button adds cards)', () => {
    const html = render();
    expect(html).toContain('href="/review?from=cards"');
    expect(html).not.toContain('aria-haspopup="menu"');
    expect(html).not.toContain('Nueva tarjeta');
    expect(html).not.toContain('Agregar desde la biblioteca');
    expect(html).not.toContain('href="/cards/word-library"');
    expect(html).not.toContain('href="/import-export');
    expect(html).not.toContain('role="menuitem"');
    expect(html).not.toContain('action-pill--mint');
  });

  it('places the actions after the title and the summary', () => {
    const html = render();
    expect(html.indexOf('<h1>')).toBeLessThan(
      html.indexOf('Repasar 12 tarjetas')
    );
    expect(html.indexOf('46 tarjetas')).toBeLessThan(
      html.indexOf('deck-header__actions')
    );
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
    expect(html).toContain('aria-label="Repasar 3 tarjetas · Trabajo"');
    expect(html).toContain('Repasar 3 tarjetas');
    expect(html).not.toContain('Repasar 12');
    expect(html).toContain('>Trabajo<');
  });

  it('keeps the review link of a folder with nothing due', () => {
    const html = render({ id: 'g1', name: 'Trabajo', dueCount: 0 });
    expect(html).toContain('href="/review?groupId=g1&amp;from=cards"');
    expect(html).toContain('Repasar tarjetas');
  });

  it('hides the decorative mascot from assistive tech', () => {
    expect(render()).toContain('alt=""');
  });

  it('offers the round size control for the desktop and the phone banner', () => {
    const html = render();
    expect(count(html, 'Ronda de:')).toBe(2);
    expect(html).toContain('>Todas<');
    expect(html).toContain('href="/review?from=cards"');
  });
});
