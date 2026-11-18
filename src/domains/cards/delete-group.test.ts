import { describe, expect, it } from 'vitest';
import {
  OTHERS_GROUP,
  OTHERS_GROUP_ID,
  canDeleteGroup,
  deleteGroupMovingCards
} from './delete-group';
import type { CardGroup, VocabularyCard } from './types';

const group = (id: string, name = id): CardGroup => ({
  id,
  name,
  description: '',
  tone: 'indigo'
});
const card = (id: string, groupId: string): VocabularyCard => ({
  id,
  term: id,
  meaning: '',
  phonetics: '',
  example: '',
  partOfSpeech: 'Sustantivo',
  groupId,
  tags: []
});

const groups = [group('work'), group('travel')];
const cards = [card('a', 'work'), card('b', 'work'), card('c', 'travel')];

describe('deleteGroupMovingCards', () => {
  it('moves the cards to a new Otros group and removes the group', () => {
    const result = deleteGroupMovingCards(groups, cards, 'work');
    expect(result.groups.map(g => g.id)).toEqual(['travel', OTHERS_GROUP_ID]);
    expect(result.groups.at(-1)).toEqual(OTHERS_GROUP);
    expect(result.cards.map(c => [c.id, c.groupId])).toEqual([
      ['a', OTHERS_GROUP_ID],
      ['b', OTHERS_GROUP_ID],
      ['c', 'travel']
    ]);
    expect(result.movedCount).toBe(2);
    expect(result.destinationGroupId).toBe(OTHERS_GROUP_ID);
  });

  it('reuses an existing Otros group (by id or by name) without duplicating', () => {
    for (const existing of [OTHERS_GROUP, group('custom-9', ' otros ')]) {
      const result = deleteGroupMovingCards(
        [...groups, existing],
        cards,
        'travel'
      );
      expect(result.groups).toHaveLength(2);
      expect(result.destinationGroupId).toBe(existing.id);
      expect(result.cards.find(c => c.id === 'c')?.groupId).toBe(existing.id);
    }
  });

  it('deletes an empty group without creating Otros', () => {
    const result = deleteGroupMovingCards(
      [...groups, group('empty')],
      cards,
      'empty'
    );
    expect(result.groups.map(g => g.id)).toEqual(['work', 'travel']);
    expect(result.cards).toBe(cards);
    expect(result.movedCount).toBe(0);
    expect(result.destinationGroupId).toBeUndefined();
  });

  it('refuses to delete Otros while it has cards', () => {
    const withOthers = [...groups, OTHERS_GROUP];
    const withCards = [...cards, card('d', OTHERS_GROUP_ID)];
    expect(canDeleteGroup(withOthers[2], withCards)).toBe(false);
    const result = deleteGroupMovingCards(
      withOthers,
      withCards,
      OTHERS_GROUP_ID
    );
    expect(result.groups).toBe(withOthers);
    expect(result.cards).toBe(withCards);
    expect(result.movedCount).toBe(0);
  });

  it('deletes an empty Otros group', () => {
    const withOthers = [...groups, OTHERS_GROUP];
    expect(canDeleteGroup(OTHERS_GROUP, cards)).toBe(true);
    const result = deleteGroupMovingCards(withOthers, cards, OTHERS_GROUP_ID);
    expect(result.groups.map(g => g.id)).toEqual(['work', 'travel']);
  });

  it('does nothing for an unknown id', () => {
    const result = deleteGroupMovingCards(groups, cards, 'nope');
    expect(result.groups).toBe(groups);
    expect(result.cards).toBe(cards);
    expect(result.movedCount).toBe(0);
  });

  it('does not mutate its inputs', () => {
    const snapshot = JSON.stringify({ groups, cards });
    deleteGroupMovingCards(groups, cards, 'work');
    expect(JSON.stringify({ groups, cards })).toBe(snapshot);
  });
});
