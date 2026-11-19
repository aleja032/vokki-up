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

describe('ReviewCardScreen D layout', () => {
  function renderWith(extra: Record<string, unknown>, isRevealed = false) {
    return renderToStaticMarkup(
      createElement(ReviewCardScreen, {
        card,
        isRevealed,
        getIntervalLabel: () => '1 día',
        onReveal: () => undefined,
        onRate: () => undefined,
        ...extra
      })
    );
  }

  it('shows the memory footer with the real level', () => {
    const html = renderWith({ memory: { level: 1, tone: 'coral' } });
    expect(html).toContain('Memoria baja');
    expect(html).toContain('aria-label="Memoria 1 de 5"');
  });

  it('cheers a running combo beside the card', () => {
    expect(renderWith({ combo: 3 })).toContain('¡Combo x3! Vas sin fallar.');
    expect(renderWith({ combo: 1 })).not.toContain('Combo');
  });

  it('offers the reveal action before the answer and ratings after it', () => {
    const hidden = renderWith({});
    expect(hidden).toContain('Mostrar significado');
    expect(hidden).not.toContain('data-tone="again"');
    const revealed = renderWith({}, true);
    expect(revealed).toContain('data-tone="again"');
    expect(revealed).not.toContain('Mostrar significado');
  });
});

describe('ReviewCardScreen Spanish example', () => {
  const withExample = {
    ...card,
    example: 'We moved the deadline to Friday afternoon.'
  } as VocabularyCard;

  it('adds an icon-only eye toggle for the stored Spanish example', () => {
    const html = render(true, {
      ...withExample,
      exampleEs: 'Movimos la fecha límite al viernes.'
    });
    expect(html).toContain('aria-label="Mostrar ejemplo en español"');
    expect(html).toContain('aria-expanded="false"');
    expect(html).toContain('Movimos la fecha límite al viernes.');
  });

  it('uses the catalog translation for an older saved card', () => {
    const html = render(true, withExample);
    expect(html).toContain('Movimos la fecha límite al viernes por la tarde.');
    expect(html).toContain('aria-controls=');
  });

  it('shows no visible text label for the toggle', () => {
    const html = render(true, withExample);
    expect(html).not.toMatch(/>s*Ejemplo en españols*</i);
  });

  it('renders no toggle when there is no Spanish example', () => {
    const html = render(true, {
      ...withExample,
      term: 'custom thing',
      example: 'A custom sentence.'
    });
    expect(html).not.toContain('aria-expanded');
    expect(html).not.toContain('aria-controls');
    expect(html).not.toContain('es-toggle');
  });

  it('keeps the toggle out of the unrevealed card', () => {
    expect(render(false, withExample)).not.toContain('aria-expanded');
  });
});
