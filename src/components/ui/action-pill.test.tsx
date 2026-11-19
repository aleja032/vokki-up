import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { ActionPill } from './action-pill';

describe('ActionPill', () => {
  it('renders a button of type button with the outline variant by default', () => {
    const html = renderToStaticMarkup(<ActionPill>Manual</ActionPill>);

    expect(html).toContain('<button');
    expect(html).toContain('type="button"');
    expect(html).toContain('action-pill--outline');
    expect(html).toContain('Manual');
  });

  it('renders a link when href is given', () => {
    const html = renderToStaticMarkup(
      <ActionPill href="/review" variant="cta">
        Repasar 12
      </ActionPill>
    );

    expect(html).toContain('<a');
    expect(html).toContain('href="/review"');
    expect(html).toContain('action-pill--cta');
    expect(html).toContain('motion-cta-pulse');
  });

  it.each(['brand', 'outline', 'cta', 'mint'] as const)(
    'applies the %s variant modifier',
    variant => {
      expect(
        renderToStaticMarkup(<ActionPill variant={variant}>x</ActionPill>)
      ).toContain(`action-pill--${variant}`);
    }
  );

  it('adds the compact modifier only for the sm size', () => {
    expect(
      renderToStaticMarkup(<ActionPill size="sm">x</ActionPill>)
    ).toContain('action-pill--sm');
    expect(renderToStaticMarkup(<ActionPill>x</ActionPill>)).not.toContain(
      'action-pill--sm'
    );
  });

  it('hides the optional icon from assistive tech and forwards disabled', () => {
    const html = renderToStaticMarkup(
      <ActionPill disabled icon={<svg data-testid="icon" />}>
        Nueva
      </ActionPill>
    );

    expect(html).toContain('class="action-pill__icon"');
    expect(html).toContain('aria-hidden="true"');
    expect(html).toContain('disabled=""');
  });

  it('exposes menu semantics and a trailing icon on button pills', () => {
    const html = renderToStaticMarkup(
      <ActionPill
        aria-controls="menu-id"
        aria-expanded={false}
        aria-haspopup="menu"
        iconEnd={<svg data-end />}
        variant="outline"
      >
        Nueva
      </ActionPill>
    );

    expect(html).toContain('aria-haspopup="menu"');
    expect(html).toContain('aria-expanded="false"');
    expect(html).toContain('aria-controls="menu-id"');
    expect(html).toMatch(/Nueva<span[^>]*><svg data-end/);
  });
});
