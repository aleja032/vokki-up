import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { ActionCard } from './action-card';

describe('ActionCard', () => {
  it('renders a link with the title and the hint when it has an href', () => {
    const html = renderToStaticMarkup(
      <ActionCard
        href="/review"
        icon={<svg />}
        subtitle="12 para hoy"
        title="Repasar"
      />
    );

    expect(html).toContain('<a ');
    expect(html).toContain('href="/review"');
    expect(html).toContain('>Repasar<');
    expect(html).toContain('>12 para hoy<');
    expect(html).toContain('action-card--outline');
  });

  it('renders a button for the solid variant without an href', () => {
    const html = renderToStaticMarkup(
      <ActionCard
        icon={<svg />}
        onClick={() => undefined}
        subtitle="Con IA o manual"
        title="Nueva tarjeta"
        variant="solid"
      />
    );

    expect(html).toContain('<button');
    expect(html).toContain('type="button"');
    expect(html).toContain('action-card--solid');
  });

  it('hides the decorative icon from assistive tech', () => {
    const html = renderToStaticMarkup(
      <ActionCard icon={<svg />} subtitle="x" title="y" onClick={() => {}} />
    );

    expect(html).toContain('aria-hidden="true"');
  });
});
