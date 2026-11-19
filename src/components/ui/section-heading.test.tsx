import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { SectionHeading } from './section-heading';

describe('SectionHeading', () => {
  it('renders the title as an h2 by default', () => {
    const html = renderToStaticMarkup(<SectionHeading title="Hoy" />);

    expect(html).toContain('<h2');
    expect(html).toContain('>Hoy</h2>');
  });

  it('supports another heading level', () => {
    expect(
      renderToStaticMarkup(<SectionHeading as="h3" title="Hoy" />)
    ).toContain('<h3');
  });

  it('renders the optional kicker with the pixel label', () => {
    const html = renderToStaticMarkup(
      <SectionHeading kicker="Esta semana" title="Actividad" />
    );

    expect(html).toContain('pixel-label');
    expect(html).toContain('Esta semana');
  });

  it('omits kicker and action when absent', () => {
    const html = renderToStaticMarkup(<SectionHeading title="Hoy" />);

    expect(html).not.toContain('pixel-label');
    expect(html).not.toContain('section-title__action');
  });

  it('renders the action slot', () => {
    const html = renderToStaticMarkup(
      <SectionHeading action={<a href="/cards">Ver todo</a>} title="Hoy" />
    );

    expect(html).toContain('section-title__action');
    expect(html).toContain('<a href="/cards">Ver todo</a>');
  });
});
