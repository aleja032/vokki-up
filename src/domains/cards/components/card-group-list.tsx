'use client';

import { ALL_GROUPS_ID } from '../hooks/use-cards-dashboard';
import { cardsMessages } from '../messages';
import type { CardGroup } from '../types';
import { DeckIcon } from './deck-icon';

const messages = cardsMessages.overview;

export type CardGroupTile = {
  group: CardGroup;
  cardCount: number;
  dueCount: number;
};

type CardGroupListProps = {
  tiles: CardGroupTile[];
  totalCards: number;
  totalDue: number;
  activeGroupId: string;
  onSelectAll: () => void;
  onOpenGroup: (groupId: string) => void;
  onAddGroup: () => void;
};

export function CardGroupList({
  tiles,
  totalCards,
  totalDue,
  activeGroupId,
  onSelectAll,
  onOpenGroup,
  onAddGroup
}: CardGroupListProps) {
  return (
    <section className="deck-groups" aria-labelledby="deck-groups-title">
      <div className="deck-groups__heading">
        <h2 id="deck-groups-title">{messages.groupsTitle}</h2>
        <button
          className="deck-groups__add deck-groups__add--compact"
          type="button"
          onClick={onAddGroup}
        >
          <DeckIcon name="plus" size={16} />
          {messages.newGroup}
        </button>
      </div>
      <div
        aria-label={messages.groupsLabel}
        className="deck-groups__list"
        role="group"
      >
        <button
          className="deck-group"
          data-tone="neutral"
          type="button"
          aria-pressed={activeGroupId === ALL_GROUPS_ID}
          onClick={onSelectAll}
        >
          <span className="deck-group__icon">
            <span className="deck-group__icon-folder">
              <DeckIcon name="folder" size={18} />
            </span>
            <span className="deck-group__icon-stack">
              <DeckIcon name="stack" size={20} />
            </span>
          </span>
          <span className="deck-group__copy">
            <strong>{messages.allGroups}</strong>
            <span>{messages.groupMeta(totalCards, totalDue)}</span>
          </span>
        </button>
        {tiles.map(({ group, cardCount, dueCount }) => (
          <button
            className="deck-group"
            data-tone={group.tone}
            type="button"
            key={group.id}
            title={group.name}
            onClick={() => onOpenGroup(group.id)}
          >
            <span className="deck-group__icon">
              <DeckIcon name="folder" size={18} />
            </span>
            <span className="deck-group__copy">
              <strong>{group.name}</strong>
              <span>{messages.groupMeta(cardCount, dueCount)}</span>
            </span>
          </button>
        ))}
        <button
          className="deck-group deck-group--add"
          type="button"
          onClick={onAddGroup}
        >
          <DeckIcon name="plus" size={18} />
          {messages.newGroup}
        </button>
      </div>
    </section>
  );
}
