import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { Pill } from './pill';

describe('Pill', () => {
  it('renders its children and defaults to the neutral tone', () => {
    const html = renderToStaticMarkup(<Pill>12 días</Pill>);

    expect(html).toContain('12 días');
    expect(html).toContain('pill--neutral');
  });

  it.each(['mint', 'amber', 'coral', 'brand', 'neutral'] as const)(
    'applies the %s tone modifier',
    tone => {
      expect(renderToStaticMarkup(<Pill tone={tone}>x</Pill>)).toContain(
        `pill--${tone}`
      );
    }
  );

  it('renders the optional icon hidden from assistive tech', () => {
    const html = renderToStaticMarkup(
      <Pill icon={<svg data-testid="icon" />}>Racha</Pill>
    );

    expect(html).toContain('class="pill__icon"');
    expect(html).toContain('aria-hidden="true"');
    expect(html).toContain('data-testid="icon"');
  });

  it('omits the icon wrapper when there is no icon', () => {
    expect(renderToStaticMarkup(<Pill>x</Pill>)).not.toContain('pill__icon');
  });
});
