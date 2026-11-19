import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { ReviewStatusChips } from './review-status-chips';

const render = (combo: number, correct: number, reviewed: number) =>
  renderToStaticMarkup(
    <ReviewStatusChips combo={combo} correct={correct} reviewed={reviewed} />
  );

describe('ReviewStatusChips', () => {
  it('always shows the offline notice and nothing else at the start', () => {
    const html = render(0, 0, 0);
    expect(html).toContain('Funciona sin conexión');
    expect(html).not.toContain('COMBO');
    expect(html).not.toContain('aciertos');
  });

  it('shows the running accuracy once a card was rated', () => {
    expect(render(0, 1, 3)).toContain('1 de 3 aciertos');
    expect(render(1, 1, 1)).toContain('1 de 1 acierto');
  });

  it('shows the combo only from a run of two', () => {
    expect(render(1, 1, 1)).not.toContain('COMBO');
    expect(render(3, 3, 3)).toContain('COMBO x3');
  });
});
