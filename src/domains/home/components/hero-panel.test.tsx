import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { homeDashboardData } from '../data';
import { HeroPanel } from './hero-panel';

const data = homeDashboardData.nextSession;

describe('HeroPanel word tags', () => {
  it('floats the first three words of the due hand, decoratively', () => {
    const html = renderToStaticMarkup(
      <HeroPanel data={data} words={['alpha', 'beta', 'gamma', 'delta']} />
    );
    expect(html).toContain('hero-panel__tags');
    expect(html).toContain('aria-hidden="true"');
    expect(html).toContain('alpha');
    expect(html).toContain('gamma');
    expect(html).not.toContain('delta');
    expect(html).toContain('motion-float-tag');
  });

  it('falls back to starter words when the hand is empty', () => {
    const html = renderToStaticMarkup(<HeroPanel data={data} />);
    expect(html).toContain('>receipt<');
  });

  it('keeps a single primary action and the library as secondary', () => {
    const html = renderToStaticMarkup(<HeroPanel data={data} />);
    expect(html.split('action-pill--primary').length - 1).toBe(1);
    expect(html).toContain('hero-panel__secondary');
  });
});
