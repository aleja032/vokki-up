import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { HeroPanel } from './hero-panel';

const session = {
  title: 'Repasar 5 tarjetas',
  pendingCount: 3,
  newCount: 2,
  estimatedMinutes: 3,
  href: '/review'
};

describe('HeroPanel', () => {
  it('announces how many words are due with an accent word', () => {
    const html = renderToStaticMarkup(<HeroPanel data={session} />);

    expect(html).toContain('5 palabras por');
    expect(html).toContain('hero-panel__accent');
    expect(html).toContain('rescatar');
  });

  it('links the call to action to the review route', () => {
    const html = renderToStaticMarkup(<HeroPanel data={session} />);

    expect(html).toContain('href="/review"');
    expect(html).toContain('Empezar ronda');
  });

  it('keeps the pending, new and minutes chips', () => {
    const html = renderToStaticMarkup(<HeroPanel data={session} />);

    expect(html).toContain('3 por repasar');
    expect(html).toContain('2 nuevas');
    expect(html).toContain('~3 min');
  });

  it('falls back to the caught-up title and hides the bubble', () => {
    const html = renderToStaticMarkup(
      <HeroPanel
        data={{
          ...session,
          title: 'Todo al día',
          pendingCount: 0,
          newCount: 0
        }}
      />
    );

    expect(html).toContain('Todo al día');
    expect(html).not.toContain('hero-panel__bubble');
    expect(html).not.toContain('rescatar');
  });

  it('uses the singular for one word', () => {
    const html = renderToStaticMarkup(
      <HeroPanel data={{ ...session, pendingCount: 1, newCount: 0 }} />
    );

    expect(html).toContain('1 palabra por');
  });
});
