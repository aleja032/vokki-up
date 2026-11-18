import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const css = readFileSync(join(__dirname, 'globals.css'), 'utf8');
const layout = readFileSync(join(__dirname, 'layout.tsx'), 'utf8');

function block(selector: string): string {
  const start = css.indexOf(`${selector} {`);
  if (start === -1) return '';
  return css.slice(start, css.indexOf('\n}', start));
}

const lightBlock = block(':root');
const darkBlock = block(":root[data-theme='dark'],\n.dark");
const mediaDarkBlock = css.slice(
  css.indexOf('@media (prefers-color-scheme: dark)'),
  css.indexOf('* {')
);

const themedTokens = [
  '--mint',
  '--mint-soft',
  '--coral',
  '--coral-soft',
  '--brand',
  '--nav',
  '--track'
];

const fixedTokens = [
  '--urgency-coral',
  '--urgency-amber',
  '--urgency-green',
  '--hero-surface',
  '--hero-lavender',
  '--cta-from',
  '--cta-to',
  '--cta-ink',
  '--cta-gradient',
  '--radius-14',
  '--radius-18',
  '--radius-22',
  '--radius-26',
  '--radius-28',
  '--radius-30',
  '--radius-34',
  '--radius-36',
  '--radius-40',
  '--radius-44',
  '--radius-pill',
  '--hover-lift'
];

describe('design tokens', () => {
  it.each(themedTokens)('defines %s in light, dark and system dark', token => {
    expect(lightBlock).toContain(`${token}:`);
    expect(darkBlock).toContain(`${token}:`);
    expect(mediaDarkBlock).toContain(`${token}:`);
  });

  it.each(fixedTokens)('defines %s once in :root', token => {
    expect(lightBlock).toContain(`${token}:`);
  });

  it('exposes semantic colors to Tailwind through @theme inline', () => {
    expect(css).toContain('@theme inline');
    expect(css).toContain('--color-mint: var(--mint)');
    expect(css).toContain('--color-coral: var(--coral)');
  });

  it.each(['mascot-bob', 'twinkle', 'cta-pulse', 'glow'])(
    'defines %s keyframes and a reduced-motion override',
    name => {
      expect(css).toContain(`@keyframes ${name}`);
      const reduced = css.slice(css.lastIndexOf('prefers-reduced-motion'));
      expect(reduced).toContain(`.motion-${name}`);
    }
  );

  it('wires the body font variables in the layout and the stylesheet', () => {
    expect(layout).toContain("variable: '--font-ui'");
    expect(layout).toContain("variable: '--font-pixel'");
    expect(layout).toContain('Plus_Jakarta_Sans');
    expect(layout).toContain('Pixelify_Sans');
    expect(css).toContain('font-family: var(--font-ui)');
    expect(css).toContain('--font-pixel');
  });
});
