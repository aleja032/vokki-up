import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import type { DueWord } from '@/lib/home/home-hand.types';
import { DueCardsHand } from './due-cards-hand';

const word = (id: string, overrides: Partial<DueWord> = {}): DueWord => ({
  id,
  term: id,
  meaning: `${id} en español`,
  phonetics: `/${id}/`,
  partOfSpeech: 'Verbo',
  memoryLevel: 1,
  isNew: false,
  tone: 'coral',
  ...overrides
});

describe('DueCardsHand', () => {
  it('renders one linked card per word with term, meaning, phonetics and memory', () => {
    const html = renderToStaticMarkup(
      <DueCardsHand
        hand={[word('borrow'), word('lend', { memoryLevel: 4, tone: 'mint' })]}
        href="/review"
        totalDue={9}
      />
    );

    expect(html.match(/class="due-card"/g)).toHaveLength(2);
    expect(html).toContain('borrow, Se olvida hoy');
    expect(html).toContain('borrow en español');
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
    expect(html).toContain('Ver las 9');
    expect(html).toContain('href="/review"');
  });

  it('explains the memory colours with the mastery legend', () => {
    const html = renderToStaticMarkup(
      <DueCardsHand hand={[word('a')]} href="/review" totalDue={1} />
    );

    for (const label of [
      'Dominio',
      'Frágil',
      'Aprendiendo',
      'Firme',
      'Dominada'
    ])
      expect(html).toContain(label);
  });

  it('shows an empty message and no link when nothing is due', () => {
    const html = renderToStaticMarkup(
      <DueCardsHand hand={[]} href="/review" totalDue={0} />
    );

    expect(html).toContain('Tu mano de hoy está vacía.');
    expect(html).not.toContain('Ver las');
    expect(html).not.toContain('class="due-card"');
  });
});
