import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import type { VocabularyCard } from '../types';
import { ReviewCardScreen } from './review-card-screen';

const card = {
  id: 'c1',
  term: 'deadline',
  meaning: 'fecha limite',
  groupId: 'g1',
  tags: [],
  partOfSpeech: 'noun'
} as unknown as VocabularyCard;

function render(isRevealed: boolean, cardOverride: VocabularyCard = card) {
  return renderToStaticMarkup(
    createElement(ReviewCardScreen, {
      card: cardOverride,
      isRevealed,
      getIntervalLabel: () => '1 día',
      onReveal: () => undefined,
      onRate: () => undefined
    })
  );
}

describe('ReviewCardScreen', () => {
  it.each([false, true])(
    'shows no keyboard hint copy (revealed=%s)',
    revealed => {
      const html = render(revealed);
      expect(html).not.toContain('Atajo');
      expect(html).not.toContain('Espacio');
      expect(html).not.toContain('tecla');
      expect(html).not.toContain('<kbd');
    }
  );
});

describe('ReviewCardScreen Spanish example', () => {
  const withExample = {
    ...card,
    example: 'We moved the deadline to Friday afternoon.'
  } as VocabularyCard;

  it('shows the eyebrow and the stored Spanish example after reveal', () => {
    const html = render(true, {
      ...withExample,
      exampleEs: 'Movimos la fecha límite al viernes.'
    });
    expect(html).toContain('Ejemplo en español');
    expect(html).toContain('Movimos la fecha límite al viernes.');
  });

  it('shows the catalog translation for an older saved card', () => {
    const html = render(true, withExample);
    expect(html).toContain('Ejemplo en español');
    expect(html).toContain('Movimos la fecha límite al viernes por la tarde.');
  });

  it('renders the eyebrow as a collapsed toggle with a hidden sentence region', () => {
    const html = render(true, withExample);
    expect(html).toMatch(/<button[^>]*type="button"[^>]*aria-expanded="false"/);
    const controls = html.match(/aria-controls="([^"]+)"/)?.[1];
    expect(controls).toBeTruthy();
    const region = html.match(
      new RegExp('<div[^>]*id="' + controls + '"[^>]*>')
    )?.[0];
    expect(region).toContain('inert');
    expect(region).toContain('aria-hidden="true"');
  });

  it('renders no toggle when there is no Spanish example', () => {
    const html = render(true, {
      ...withExample,
      term: 'custom thing',
      example: 'A custom sentence.'
    });
    expect(html).not.toContain('aria-expanded');
    expect(html).not.toContain('aria-controls');
  });

  it('renders no eyebrow when there is no Spanish example', () => {
    const html = render(true, {
      ...withExample,
      term: 'custom thing',
      example: 'A custom sentence.'
    });
    expect(html).not.toContain('Ejemplo en español');
    expect(html).not.toContain('drill-es');
  });

  it('keeps the Spanish example hidden before reveal', () => {
    expect(render(false, withExample)).not.toContain('Ejemplo en español');
  });
});
