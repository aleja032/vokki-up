import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import type { CardGroup, VocabularyCard } from '../types';
import { OTHERS_GROUP } from '../delete-group';
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

function render(cards: VocabularyCard[], target: CardGroup = group) {
  return renderToStaticMarkup(
    createElement(GroupDetail, {
      group: target,
      cards,
      schedules: {},
      dueCount: 0,
      masteredPercent: 0,
      onBack: () => undefined,
      onAddCard: () => undefined,
      onDelete: () => undefined
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

describe('GroupDetail delete dialog', () => {
  it('renders the shared confirm dialog and no inline confirm', () => {
    const html = render([card]);
    expect(html).toContain('class="confirm-dialog"');
    expect(html).toContain('role="alertdialog"');
    expect(html).toContain('>Eliminar grupo<');
    expect(html).toContain(
      'Se eliminará “Trabajo”. Su 1 tarjeta pasará a “Otros” y conserva su progreso.'
    );
    expect(html).not.toContain('deck-confirm');
  });

  it('says there is nothing to move when the group is empty', () => {
    expect(render([])).toContain(
      'Se eliminará “Trabajo”. El grupo no tiene tarjetas.'
    );
  });

  it('keeps Otros in place while it has cards (menu stays closed here)', () => {
    const othersCard = { ...card, groupId: OTHERS_GROUP.id };
    const html = render([othersCard], OTHERS_GROUP);
    expect(html).toContain('Su 1 tarjeta pasará a');
  });
});
