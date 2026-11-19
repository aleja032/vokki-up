import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import type { DueWord } from '@/lib/home/home-hand.types';
import { DueCardsHand } from './due-cards-hand';

const word = (id: string, overrides: Partial<DueWord> = {}): DueWord => ({
  id,
  term: id,
  phonetics: `/${id}/`,
  partOfSpeech: 'Verbo',
  memoryLevel: 1,
  isNew: false,
  tone: 'coral',
  ...overrides
});

describe('DueCardsHand', () => {
  it('renders one linked card per word with term, phonetics and memory', () => {
    const html = renderToStaticMarkup(
      <DueCardsHand
        hand={[word('borrow'), word('lend', { memoryLevel: 4, tone: 'mint' })]}
        href="/review"
        totalDue={9}
      />
    );

    expect(html.match(/class="due-card"/g)).toHaveLength(2);
    expect(html).toContain('borrow, Se olvida hoy');
    expect(html).toContain('/borrow/');
    expect(html).toContain('aria-label="Memoria 4 de 5"');
    expect(html).toContain('lend, Repasa hoy');
  });

  it('labels new words and offers the full list link', () => {
    const html = renderToStaticMarkup(
      <DueCardsHand
        hand={[word('fresh', { isNew: true, memoryLevel: 0, tone: 'brand' })]}
        href="/review"
        totalDue={9}
      />
    );

    expect(html).toContain('fresh, Nueva');
    expect(html).toContain('Ver todas (9)');
    expect(html).toContain('href="/review"');
  });

  it('fans the cards with a tilt that depends on the hand size', () => {
    const html = renderToStaticMarkup(
      <DueCardsHand
        hand={[word('a'), word('b'), word('c'), word('d')]}
        href="/review"
        totalDue={4}
      />
    );

    expect(html).toContain('data-tilt="-6"');
    expect(html).toContain('data-tilt="6"');
  });

  it('shows an empty message and no link when nothing is due', () => {
    const html = renderToStaticMarkup(
      <DueCardsHand hand={[]} href="/review" totalDue={0} />
    );

    expect(html).toContain('Tu mano de hoy está vacía.');
    expect(html).not.toContain('Ver todas');
    expect(html).not.toContain('due-card');
  });
});
