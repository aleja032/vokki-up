import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { SegmentedToggle } from './segmented-toggle';

const options = [
  { value: 'es', label: 'Español' },
  { value: 'en', label: 'English' }
] as const;

describe('SegmentedToggle', () => {
  it('renders a named group with one pressed option', () => {
    const html = renderToStaticMarkup(
      <SegmentedToggle
        labelledBy="language-label"
        onChange={() => undefined}
        options={options}
        value="en"
      />
    );

    expect(html).toContain('role="group"');
    expect(html).toContain('aria-labelledby="language-label"');
    expect(html).toContain('English');
    expect(html.match(/aria-pressed="true"/g)).toHaveLength(1);
    expect(html.match(/aria-pressed="false"/g)).toHaveLength(1);
  });

  it('marks the active value as pressed', () => {
    const html = renderToStaticMarkup(
      <SegmentedToggle
        labelledBy="x"
        onChange={() => undefined}
        options={options}
        value="es"
      />
    );

    expect(html).toMatch(/aria-pressed="true"[^>]*>Español/);
  });

  it('renders the filter variant with dots, counts and an accessible name', () => {
    const html = renderToStaticMarkup(
      <SegmentedToggle
        ariaLabel="Filtrar por estado"
        onChange={() => undefined}
        options={[
          { value: 'all', label: 'Todas', count: 46 },
          { value: 'due', label: 'Para hoy', count: 12, dot: 'coral' }
        ]}
        value="all"
        variant="filter"
      />
    );

    expect(html).toContain('aria-label="Filtrar por estado"');
    expect(html).toContain('segmented-toggle--filter');
    expect(html).toContain('data-dot="coral"');
    expect(html).toMatch(/Todas<span[^>]*>46<\/span>/);
    expect(html.match(/aria-pressed="true"/g)).toHaveLength(1);
  });
});

describe('SegmentedToggle short labels', () => {
  it('renders the long and the short label only when a short one is given', () => {
    const html = renderToStaticMarkup(
      <SegmentedToggle
        onChange={() => undefined}
        options={[
          { value: 'a', label: 'Esta semana', shortLabel: 'Semana' },
          { value: 'b', label: 'Hoy' }
        ]}
        value="a"
        variant="filter"
      />
    );
    expect(html).toContain('segmented-toggle__long">Esta semana<');
    expect(html).toContain('segmented-toggle__short">Semana<');
    expect(html.match(/segmented-toggle__short/g)).toHaveLength(1);
  });
});
