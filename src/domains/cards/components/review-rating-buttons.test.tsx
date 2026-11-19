import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { ReviewRatingButtons } from './review-rating-buttons';

describe('ReviewRatingButtons', () => {
  const html = renderToStaticMarkup(
    createElement(ReviewRatingButtons, {
      getIntervalLabel: rating => `next ${rating}`,
      onRate: () => undefined
    })
  );

  it('renders the three ratings with their next interval', () => {
    expect(html).toContain('data-tone="again"');
    expect(html).toContain('data-tone="good"');
    expect(html).toContain('data-tone="easy"');
    expect(html).toContain('Difícil');
    expect(html).toContain('Bien');
    expect(html).toContain('Fácil');
    expect(html).toContain('next again');
    expect(html).toContain('next easy');
  });

  it('groups the buttons under an accessible name and prompt', () => {
    expect(html).toContain('role="group"');
    expect(html).toContain('aria-label="Califica esta tarjeta"');
    expect(html).toContain('¿Qué tan fácil fue recordarla?');
  });

  it('shows no keyboard hint copy', () => {
    expect(html).not.toContain('<kbd');
    expect(html).not.toContain('tecla');
  });
});
