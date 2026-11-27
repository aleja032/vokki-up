import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { ReviewBanner } from './review-banner';

function render(
  options: { count?: number; folder?: { id: string; name: string } } = {}
) {
  return renderToStaticMarkup(
    createElement(ReviewBanner, {
      count: options.count ?? 7,
      folder: options.folder
    })
  );
}

describe('ReviewBanner', () => {
  it('is a labelled section with a decorative Noma', () => {
    const html = render();
    expect(html).toMatch(/<section[^>]*aria-label="Repaso de hoy"/);
    expect(html).toContain('noma-cheer');
    expect(html).toContain('alt=""');
    expect(html).toContain('motion-mascot-bob');
  });

  it('says how many cards are ready and how long it takes', () => {
    const html = render({ count: 7 });
    expect(html).toContain('>Hoy<');
    expect(html).toContain('7 tarjetas listas');
    expect(html).toContain('~4 min · disponible sin conexión');
  });

  it('handles one card', () => {
    const html = render({ count: 1 });
    expect(html).toContain('1 tarjeta lista');
    expect(html).toContain('~1 min');
  });

  it('has one primary Repasar link that pulses while there is something due', () => {
    const html = render({ count: 7 });
    expect(html).toMatch(/<a[^>]*action-pill--primary[^>]*>/);
    expect(html).toContain('href="/review?from=cards"');
    expect(html).toContain('Repasar 7 tarjetas');
    expect(html).toContain('motion-cta-pulse');
    expect(html.match(/action-pill--primary/g)).toHaveLength(1);
  });

  it('follows the selected folder: kicker, link and accessible name', () => {
    const html = render({ count: 3, folder: { id: 'g 1', name: 'Trabajo' } });
    expect(html).toContain('>Trabajo<');
    expect(html).not.toContain('>Hoy<');
    expect(html).toContain('href="/review?groupId=g%201&amp;from=cards"');
    expect(html).toContain('aria-label="Repasar 3 tarjetas · Trabajo"');
  });

  it('is calm when nothing is due and keeps the same link', () => {
    const html = render({ count: 0 });
    expect(html).toContain('Todo al día');
    expect(html).toContain('Vuelve mañana o agrega tarjetas');
    expect(html).not.toContain('disponible sin conexión');
    expect(html).toContain('Repasar tarjetas');
    expect(html).toContain('href="/review?from=cards"');
    expect(html).not.toContain('motion-cta-pulse');
  });

  it('follows the round size in the link and shows the size control', () => {
    const html = renderToStaticMarkup(
      createElement(ReviewBanner, {
        count: 20,
        folder: { id: 'g1', name: 'Trabajo' },
        roundSize: 20,
        onRoundSizeChange: () => undefined
      })
    );
    expect(html).toContain(
      'href="/review?groupId=g1&amp;from=cards&amp;size=20"'
    );
    expect(html).toContain('Ronda de:');
    expect(html.match(/action-pill--primary/g)).toHaveLength(1);
  });
});
