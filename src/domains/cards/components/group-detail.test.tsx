import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import type { CardGroup, VocabularyCard } from '../types';
import { GroupDetail } from './group-detail';

const group = {
  id: 'g1',
  name: 'Trabajo',
  tone: 'indigo'
} as unknown as CardGroup;

const card = {
  id: 'c1',
  term: 'deadline',
  meaning: 'fecha limite',
  groupId: 'g1'
} as unknown as VocabularyCard;

function render(cards: VocabularyCard[]) {
  return renderToStaticMarkup(
    createElement(GroupDetail, {
      group,
      cards,
      schedules: {},
      dueCount: 0,
      masteredPercent: 0,
      onBack: () => undefined,
      onAddCard: () => undefined
    })
  );
}

const count = (html: string, text: string) => html.split(text).length - 1;

describe('GroupDetail add actions', () => {
  it('shows one primary add action and the library link when empty', () => {
    const html = render([]);
    expect(count(html, '>Añadir tarjeta<')).toBe(1);
    expect(count(html, '>Añadir<')).toBe(0);
    expect(count(html, 'href="/cards/word-library"')).toBe(1);
    expect(html).toContain('Agregar desde la biblioteca');
  });

  it('shows the header add action and the library link with cards', () => {
    const html = render([card]);
    expect(count(html, '>Añadir<')).toBe(1);
    expect(count(html, '>Añadir tarjeta<')).toBe(0);
    expect(count(html, 'href="/cards/word-library"')).toBe(1);
  });
});
