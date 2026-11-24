import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { ActionPill, actionPillClass } from './action-pill';

describe('ActionPill', () => {
  it('renders a button of type button with the secondary variant by default', () => {
    const html = renderToStaticMarkup(<ActionPill>Manual</ActionPill>);

    expect(html).toContain('<button');
    expect(html).toContain('type="button"');
    expect(html).toContain('action-pill--secondary');
    expect(html).toContain('Manual');
  });

  it('renders a link when href is given', () => {
    const html = renderToStaticMarkup(
      <ActionPill href="/review" pulse variant="primary">
        Repasar 12
      </ActionPill>
    );

    expect(html).toContain('<a');
    expect(html).toContain('href="/review"');
    expect(html).toContain('action-pill--primary');
    expect(html).toContain('motion-cta-pulse');
  });

  it.each(['primary', 'secondary', 'tertiary', 'danger'] as const)(
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
        variant="secondary"
      >
        Nueva
      </ActionPill>
    );

    expect(html).toContain('aria-haspopup="menu"');
    expect(html).toContain('aria-expanded="false"');
    expect(html).toContain('aria-controls="menu-id"');
    expect(html).toMatch(/Nueva<span[^>]*><svg data-end/);
  });

  it('only pulses when asked to', () => {
    expect(
      renderToStaticMarkup(<ActionPill variant="primary">x</ActionPill>)
    ).not.toContain('motion-cta-pulse');
  });

  it('exposes the same classes for native elements', () => {
    expect(actionPillClass('danger', 'sm')).toBe(
      'action-pill action-pill--danger action-pill--sm'
    );
    expect(actionPillClass()).toBe('action-pill action-pill--secondary');
  });

  describe('mint tone', () => {
    it('adds the mint modifier only when asked', () => {
      expect(
        renderToStaticMarkup(<ActionPill tone="mint">x</ActionPill>)
      ).toContain('action-pill--mint');
      expect(renderToStaticMarkup(<ActionPill>x</ActionPill>)).not.toContain(
        'action-pill--mint'
      );
    });

    it('exposes the tone for native elements', () => {
      expect(actionPillClass('secondary', 'md', 'mint')).toBe(
        'action-pill action-pill--secondary action-pill--mint'
      );
      expect(actionPillClass('tertiary', 'sm', 'mint')).toBe(
        'action-pill action-pill--tertiary action-pill--sm action-pill--mint'
      );
    });

    it('recolors only through tokens, never size or spacing', () => {
      const css = readFileSync(join(__dirname, 'action-pill.css'), 'utf8');
      const rules = css
        .split('}')
        .filter(rule => rule.includes('.action-pill--mint'))
        .join('}');
      expect(rules).toContain('--mint');
      expect(rules).not.toMatch(
        /(^|\s)(min-)?h-|\bp[xy]?-|text-\[|#[0-9a-f]{3,6}\b/i
      );
    });
  });

  describe('fixed sizes', () => {
    const css = readFileSync(join(__dirname, 'action-pill.css'), 'utf8');
    const block = (selector: string) => {
      const start = css.indexOf(`\n${selector} {`);
      return start === -1 ? '' : css.slice(start, css.indexOf('}', start));
    };

    it('sets the md height once, on the base class', () => {
      expect(block('.action-pill')).toMatch(/\bh-14\b/);
      expect(block('.action-pill')).toMatch(/md:h-13/);
    });

    it.each(['primary', 'secondary', 'danger'])(
      'the %s variant never changes height, padding scale or type size',
      variant => {
        const rules = block(`.action-pill--${variant}`);
        expect(rules).not.toMatch(/(^|\s)(min-)?h-|\bpy-|text-\[/);
      }
    );

    it('shares one compact height between sm and tertiary', () => {
      expect(block('.action-pill--sm,\n.action-pill--tertiary')).toMatch(
        /h-11 md:h-11/
      );
    });
  });
});
