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

// Values copied from the theme objects (claro / oscuro) of the violet D
// artboards (VokkiD.dc.html and siblings).
const designLight: Record<string, string> = {
  '--ground': '#f7f4ee',
  '--nav': '#ffffff',
  '--surface': '#ffffff',
  '--surface-muted': '#f1ede6',
  '--line': '#e6e1d8',
  '--ink': '#1b1a2e',
  '--ink-soft': '#5b5873',
  '--track': '#e6e1d8',
  '--mint': '#0b6e55',
  '--mint-soft': '#ddf8ef',
  '--amber-ink': '#9a4a00',
  '--amber-soft': '#ffebd6',
  '--coral': '#b5402d',
  '--coral-soft': '#ffe8e3',
  '--indigo': '#5b3fe0',
  '--indigo-soft': '#ede8ff',
  '--brand': '#7456ff',
  '--on-indigo': '#ffffff',
  '--on-brand': '#ffffff',
  '--hover-accent': '#7456ff',
  '--hover-accent-glow': 'rgb(116 86 255 / 0.22)',
  '--focus-ring': '#5b3fe0'
};

const designDark: Record<string, string> = {
  '--ground': '#0f0d16',
  '--nav': '#14111c',
  '--surface': '#1a1724',
  '--surface-muted': '#221e2f',
  '--line': '#2f2a3f',
  '--ink': '#f4f1fa',
  '--ink-soft': '#a8a2bd',
  '--track': '#2f2a3f',
  '--mint': '#6ee7c2',
  '--mint-soft': '#102e29',
  '--amber-ink': '#ffb877',
  '--amber-soft': '#3a2414',
  '--coral': '#ffab9c',
  '--coral-soft': '#36202a',
  '--indigo': '#c3b4ff',
  '--indigo-soft': '#2b2350',
  '--brand': '#7456ff',
  '--brand-line': '#a99bff',
  '--on-indigo': '#14102e',
  '--hover-accent': '#a99bff',
  '--hover-accent-glow': 'rgb(169 155 255 / 0.22)',
  '--focus-ring': '#c3b4ff'
};

// Colors that do not change with the theme in the proposal.
const designFixed: Record<string, string> = {
  '--hero-surface': '#191531',
  '--hero-lavender': '#c3b4ff',
  '--hero-text-soft': '#d6d0ea',
  '--hero-accent': '#6ee7c2',
  '--hero-star': '#ffe9c2',
  '--hero-bubble-bg': '#ffffff',
  '--hero-bubble-ink': '#1b1a2e',
  '--hero-glow': 'rgb(116 86 255 / 0.24)',
  '--hero-shade-80': 'rgb(25 21 49 / 0.8)',
  '--hero-shade-10': 'rgb(25 21 49 / 0.1)',
  '--hero-shade-95': 'rgb(25 21 49 / 0.95)',
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
  '--chart-line': '#2a8f6c',
  '--chart-vein': '#138a66',
  '--chart-area-top': 'rgb(47 203 155 / 0.28)',
  '--chart-today-fill': 'rgb(47 203 155 / 0.25)',
  // Notes and settings: dialog backdrop/shadow and the theme preview swatches
  // (they show the real light and dark grounds whatever the active theme is).
  '--scrim': 'rgb(20 20 22 / 0.42)',
  '--shadow-dialog': 'rgb(20 20 22 / 0.28)',
  '--theme-light': '#f7f4ee',
  '--theme-dark': '#0f0d16',
  '--theme-accent': '#6ee7c2'
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

describe('violet palette, whole site', () => {
  it('has no scoped accent override left: the global palette is violet', () => {
    expect(css).not.toContain('.accent-violet');
  });

  it('draws the due states with violet, ink and mint instead of coral or amber', () => {
    expect(declared(lightBlock, '--due-now')).toBe('var(--brand)');
    expect(declared(lightBlock, '--due-soon')).toBe('var(--ink-soft)');
    expect(declared(lightBlock, '--due-safe')).toBe('var(--mint)');
    expect(darkBlock).not.toContain('--due-');
  });

  it('keeps the CTA gradient mint in both themes', () => {
    expect(declared(lightBlock, '--cta-from')).toBe('#5be8bc');
    expect(darkBlock).not.toContain('--cta-from');
  });
});

// Folder colors (Mi mazo): six hues, none of them orange, amber or coral. Each
// one has a strong and a soft token in light and in dark (system dark too).
const folderColors: Record<string, { light: string[]; dark: string[] }> = {
  indigo: { light: ['#5b3fe0', '#ede8ff'], dark: ['#9b87ff', '#2b2350'] },
  lavender: { light: ['#a15fd3', '#f4e8fb'], dark: ['#d19af0', '#3a2147'] },
  blue: { light: ['#2563c9', '#e1ebfb'], dark: ['#7aa7f5', '#1c2a47'] },
  teal: { light: ['#0e7490', '#d8eff5'], dark: ['#5cc8dd', '#12303a'] },
  green: { light: ['#3f7d1f', '#e6f3d9'], dark: ['#9ad46b', '#243319'] },
  gray: { light: ['#5b5873', '#ece9e2'], dark: ['#a8a2bd', '#2a2636'] }
};

describe('folder colors', () => {
  it.each(Object.entries(folderColors))(
    '%s has its strong and soft token in light and dark',
    (name, { light, dark }) => {
      const tokens = [`--folder-${name}`, `--folder-${name}-soft`];
      tokens.forEach((token, index) => {
        expect(declared(lightBlock, token)).toBe(light[index]);
        expect(declared(darkBlock, token)).toBe(dark[index]);
        expect(declared(mediaDarkBlock, token)).toBe(dark[index]);
      });
    }
  );

  it.each(Object.keys(folderColors))(
    'maps data-folder-color=%s to --folder-ink and --folder-bg in one place',
    name => {
      const rule = css.slice(css.indexOf(`[data-folder-color='${name}'] {`));
      expect(rule).toContain(`--folder-ink: var(--folder-${name});`);
      expect(rule).toContain(`--folder-bg: var(--folder-${name}-soft);`);
    }
  );

  it('has no orange, amber or coral folder color', () => {
    expect(Object.keys(folderColors)).toHaveLength(6);
    expect(css).not.toMatch(/--folder-(amber|coral|orange|red)/);
  });
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
