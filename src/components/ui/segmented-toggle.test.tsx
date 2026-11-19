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
});
