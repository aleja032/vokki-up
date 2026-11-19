import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { PixelLabel } from './pixel-label';

describe('PixelLabel', () => {
  it('renders the caller text in the pixel label class', () => {
    const html = renderToStaticMarkup(<PixelLabel>Racha</PixelLabel>);

    expect(html).toContain('pixel-label');
    expect(html).toContain('>Racha</span>');
  });

  it('merges a caller class name', () => {
    const html = renderToStaticMarkup(
      <PixelLabel className="extra">Hoy</PixelLabel>
    );

    expect(html).toContain('pixel-label');
    expect(html).toContain('extra');
  });
});
