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

function render(isRevealed: boolean) {
  return renderToStaticMarkup(
    createElement(ReviewCardScreen, {
      card,
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
