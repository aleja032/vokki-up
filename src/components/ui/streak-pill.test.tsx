import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { StreakPill } from './streak-pill';

describe('StreakPill', () => {
  it('shows the day count and speaks the unit', () => {
    const html = renderToStaticMarkup(<StreakPill days={12} />);

    expect(html).toContain('>12</span>');
    expect(html).toContain('aria-label="Racha de 12 días"');
    expect(html).toContain('pill--soft');
  });
});
