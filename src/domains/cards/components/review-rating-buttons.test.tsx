import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { REVIEW_RATINGS } from '../hooks/use-card-review';
import { ReviewRatingButtons } from './review-rating-buttons';

describe('ReviewRatingButtons', () => {
  const html = renderToStaticMarkup(
    createElement(ReviewRatingButtons, {
      getIntervalLabel: rating => `next ${rating}`,
      onRate: () => undefined
    })
  );

  it('offers the four ratings in order', () => {
    expect(REVIEW_RATINGS).toEqual(['again', 'hard', 'good', 'easy']);
    const tones = [...html.matchAll(/data-tone="(\w+)"/g)].map(m => m[1]);
    expect(tones).toEqual(['again', 'hard', 'good', 'easy']);
    const labels = [...html.matchAll(/review-rating__label">([^<]+)</g)].map(
      m => m[1]
    );
    expect(labels).toEqual(['Otra vez', 'Difícil', 'Bien', 'Fácil']);
  });

  it('shows the next interval of every rating', () => {
    for (const rating of REVIEW_RATINGS)
      expect(html).toContain(`next ${rating}`);
  });

  it('groups the buttons under an accessible name and prompt', () => {
    expect(html).toContain('role="group"');
    expect(html).toContain('aria-label="Califica esta tarjeta"');
    expect(html).toContain('¿Qué tan fácil lo recordaste?');
  });

  it('marks each rating with a dot and no orange tone', () => {
    expect(html.match(/review-rating__dot/g)).toHaveLength(4);
    expect(html).not.toContain('coral');
  });

  it('shows no keyboard hint copy', () => {
    expect(html).not.toContain('<kbd');
    expect(html).not.toContain('tecla');
  });
});
