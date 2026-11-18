import type { CardGroup, VocabularyCard } from './types';

export const OTHERS_GROUP_ID = 'others';

/** Catch-all group that receives the cards of a deleted group. */
export const OTHERS_GROUP: CardGroup = {
  id: OTHERS_GROUP_ID,
  name: 'Otros',
  description: 'Tarjetas de grupos eliminados',
  tone: 'gray'
};

export type DeleteGroupResult = {
  groups: CardGroup[];
  cards: VocabularyCard[];
  movedCount: number;
  destinationGroupId: string | undefined;
};

function isOthers(group: CardGroup) {
  return (
    group.id === OTHERS_GROUP_ID ||
    group.name.trim().toLocaleLowerCase() ===
      OTHERS_GROUP.name.toLocaleLowerCase()
  );
}

/** Otros can only go away once it is empty; every other group can. */
export function canDeleteGroup(
  group: CardGroup,
  cards: readonly VocabularyCard[]
) {
  return !isOthers(group) || !cards.some(card => card.groupId === group.id);
}

/**
 * Removes a group and moves its cards to "Otros" (created once when missing).
 * An empty group is just removed. Unknown ids and a non-empty "Otros" return
 * the inputs untouched.
 */
export function deleteGroupMovingCards(
  groups: CardGroup[],
  cards: VocabularyCard[],
  groupId: string
): DeleteGroupResult {
  const target = groups.find(group => group.id === groupId);
  const unchanged = {
    groups,
    cards,
    movedCount: 0,
    destinationGroupId: undefined
  };
  if (!target || !canDeleteGroup(target, cards)) return unchanged;

  const moving = cards.filter(card => card.groupId === groupId);
  const remaining = groups.filter(group => group.id !== groupId);
  if (moving.length === 0) return { ...unchanged, groups: remaining };

  const existing = remaining.find(isOthers);
  const destination = existing ?? OTHERS_GROUP;
  return {
    groups: existing ? remaining : [...remaining, OTHERS_GROUP],
    cards: cards.map(card =>
      card.groupId === groupId ? { ...card, groupId: destination.id } : card
    ),
    movedCount: moving.length,
    destinationGroupId: destination.id
  };
}
