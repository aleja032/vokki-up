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

// Values copied from the theme objects of VokkiD.dc.html / VokkiDLight.dc.html.
const designLight: Record<string, string> = {
  '--ground': '#f7f4ee',
  '--nav': '#ffffff',
  '--surface': '#ffffff',
  '--surface-muted': '#f0eee8',
  '--line': '#e3e0d8',
  '--ink': '#17202b',
  '--ink-soft': '#566275',
  '--track': '#e3e0d8',
  '--mint': '#0a6b4f',
  '--mint-soft': '#e1f6ee',
  '--amber-ink': '#8a5a00',
  '--amber-soft': '#fff0d0',
  '--coral': '#a33a1b',
  '--coral-soft': '#ffe9e2',
  '--indigo': '#4a3ac9',
  '--indigo-soft': '#e9e6fb',
  '--brand': '#4a3ac9',
  '--on-indigo': '#ffffff'
};

const designDark: Record<string, string> = {
  '--ground': '#0c1118',
  '--nav': '#111823',
  '--surface': '#151c27',
  '--surface-muted': '#1b2433',
  '--line': '#243044',
  '--ink': '#eef2f7',
  '--ink-soft': '#9aa8bc',
  '--track': '#2a3649',
  '--mint': '#6ee7be',
  '--mint-soft': '#0f2e2a',
  '--amber-ink': '#ffd27a',
  '--amber-soft': '#33260f',
  '--coral': '#ffa68e',
  '--coral-soft': '#33191a',
  '--indigo': '#c8c0ff',
  '--indigo-soft': '#2b2766',
  '--brand': '#8e84ff',
  '--on-indigo': '#14102e'
};

// Colors that do not change with the theme in the proposal.
const designFixed: Record<string, string> = {
  '--hero-surface': '#0b1520',
  '--hero-lavender': '#b8adff',
  '--hero-text-soft': '#c9d4e2',
  '--hero-accent': '#6ee7be',
  '--hero-star': '#ffe9c2',
  '--hero-bubble-bg': '#ffffff',
  '--hero-bubble-ink': '#16202c',
  '--hero-glow': 'rgb(142 132 255 / 0.24)',
  '--hero-shade-80': 'rgb(11 21 32 / 0.8)',
  '--hero-shade-10': 'rgb(11 21 32 / 0.1)',
  '--hero-shade-95': 'rgb(11 21 32 / 0.95)',
  '--on-hero-track': 'rgb(255 255 255 / 0.2)',
  '--urgency-coral': '#ff7a59',
  '--urgency-amber': '#ffb84d',
  '--urgency-green': '#2fcb9b',
  '--cta-from': '#5be8bc',
  '--cta-to': '#2fcb9b',
  '--cta-ink': '#062b20',
  '--cta-glow-ring': 'rgb(47 203 155 / 0.5)',
  '--cta-glow': 'rgb(47 203 155 / 0.35)',
  '--cta-fab-glow': 'rgb(47 203 155 / 0.4)',
  '--shadow-mascot': 'rgb(0 0 0 / 0.5)',
  '--shadow-mascot-soft': 'rgb(0 0 0 / 0.4)',
  '--shadow-bubble': 'rgb(0 0 0 / 0.3)',
  '--shadow-card': 'rgb(0 0 0 / 0.28)',
  '--shadow-nav': 'rgb(0 0 0 / 0.3)',
  '--hover-accent': '#8e84ff',
  '--hover-accent-glow': 'rgb(142 132 255 / 0.22)',
  '--chart-line': '#2a8f6c',
  '--chart-vein': '#138a66',
  '--chart-area-top': 'rgb(47 203 155 / 0.28)',
  '--chart-today-fill': 'rgb(47 203 155 / 0.25)',
  // Notes and settings: dialog backdrop/shadow and the theme preview swatches
  // (they show the real light and dark grounds whatever the active theme is).
  '--scrim': 'rgb(20 20 22 / 0.42)',
  '--shadow-dialog': 'rgb(20 20 22 / 0.28)',
  '--theme-light': '#f7f4ee',
  '--theme-dark': '#0c1118',
  '--theme-accent': '#6ee7be'
};

function declared(source: string, token: string): string | undefined {
  return source.match(new RegExp(`${token}:\\s*([^;]+);`))?.[1].trim();
}

describe('proposal D palette', () => {
  it.each(Object.entries(designLight))('%s is %s in light', (token, value) => {
    expect(declared(lightBlock, token)).toBe(value);
  });

  it.each(Object.entries(designDark))('%s is %s in dark', (token, value) => {
    expect(declared(darkBlock, token)).toBe(value);
    expect(declared(mediaDarkBlock, token)).toBe(value);
  });

  it.each(Object.entries(designFixed))(
    '%s is %s in both themes',
    (token, value) => {
      expect(declared(lightBlock, token)).toBe(value);
      expect(darkBlock).not.toContain(`${token}:`);
    }
  );
});

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
