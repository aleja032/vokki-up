import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { ExampleEsToggle } from './example-es-toggle';

function render(sentence: string | undefined) {
  return renderToStaticMarkup(
    <ExampleEsToggle sentence={sentence}>
      <p>We moved the deadline.</p>
    </ExampleEsToggle>
  );
}

describe('ExampleEsToggle', () => {
  it('renders an icon-only collapsed toggle with an accessible name', () => {
    const html = render('Movimos la fecha límite.');
    expect(html).toMatch(/<button[^>]*type="button"/);
    expect(html).toContain('aria-expanded="false"');
    expect(html).toContain('aria-label="Mostrar ejemplo en español"');
    expect(html).toContain('title="Mostrar ejemplo en español"');
    expect(html).toContain('<svg');
    // The button has no visible text: only the svg inside it.
    expect(html).toMatch(
      /<button[^>]*>\s*<svg[^>]*>[\s\S]*<\/svg>\s*<\/button>/
    );
  });

  it('keeps the sentence in an inert, hidden region while collapsed', () => {
    const html = render('Movimos la fecha límite.');
    const controls = html.match(/aria-controls="([^"]+)"/)?.[1];
    expect(controls).toBeTruthy();
    const region = html.match(
      new RegExp('<span[^>]*id="' + controls + '"[^>]*>')
    )?.[0];
    expect(region).toContain('inert');
    expect(region).toContain('aria-hidden="true"');
  });

  it('renders the example untouched when there is no Spanish sentence', () => {
    for (const sentence of [undefined, '']) {
      const html = render(sentence);
      expect(html).toBe('<p>We moved the deadline.</p>');
    }
  });
});
