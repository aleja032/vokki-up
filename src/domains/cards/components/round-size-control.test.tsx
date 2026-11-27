import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { RoundSizeControl } from './round-size-control';

function render(size: 10 | 20 | 50 = 10) {
  return renderToStaticMarkup(
    <RoundSizeControl size={size} onChange={() => undefined} />
  );
}

describe('RoundSizeControl', () => {
  it('is a labelled radio group with 10, 20 and Todas', () => {
    const html = render();
    expect(html).toContain('role="radiogroup"');
    expect(html).toContain('aria-label="Tamaño de la ronda"');
    expect(html).toContain('Ronda de:');
    expect(html).toContain('>10<');
    expect(html).toContain('>20<');
    expect(html).toContain('>Todas<');
    expect(html.match(/role="radio"/g)).toHaveLength(3);
  });

  it('marks only the chosen size as checked', () => {
    const html = render(20);
    expect(html.match(/aria-checked="true"/g)).toHaveLength(1);
    expect(html).toMatch(/aria-checked="true"[^>]*>20</);
  });
});
