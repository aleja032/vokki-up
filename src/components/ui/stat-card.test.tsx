import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { StatCard } from './stat-card';

describe('StatCard', () => {
  it('renders value and label', () => {
    const html = renderToStaticMarkup(<StatCard label="Racha" value="12" />);

    expect(html).toContain('class="stat-tile__value"');
    expect(html).toContain('>12</strong>');
    expect(html).toContain('>Racha</span>');
  });

  it('renders the icon slot hidden from assistive tech', () => {
    const html = renderToStaticMarkup(
      <StatCard icon={<svg data-testid="icon" />} label="x" value="1" />
    );

    expect(html).toContain('stat-tile__icon');
    expect(html).toContain('aria-hidden="true"');
    expect(html).toContain('data-testid="icon"');
  });

  it('omits the icon wrapper without an icon', () => {
    expect(
      renderToStaticMarkup(<StatCard label="x" value="1" />)
    ).not.toContain('stat-tile__icon');
  });

  it.each(['mint', 'amber', 'coral', 'brand'] as const)(
    'applies the %s tone modifier',
    tone => {
      expect(
        renderToStaticMarkup(<StatCard label="x" tone={tone} value="1" />)
      ).toContain(`stat-tile--${tone}`);
    }
  );

  it('adds the soft variant modifier only when requested', () => {
    expect(
      renderToStaticMarkup(<StatCard label="x" value="1" variant="soft" />)
    ).toContain('stat-tile--soft');
    expect(
      renderToStaticMarkup(<StatCard label="x" value="1" />)
    ).not.toContain('stat-tile--soft');
  });

  it('defaults to the brand tone', () => {
    expect(renderToStaticMarkup(<StatCard label="x" value="1" />)).toContain(
      'stat-tile--brand'
    );
  });
});
