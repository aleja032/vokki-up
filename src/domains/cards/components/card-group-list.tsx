'use client';

import { FolderTile } from '@/components/ui/folder-tile';
import { ALL_GROUPS_ID } from '../hooks/use-cards-dashboard';
import {
  getGroupDisplayDescription,
  getGroupDisplayName
} from '../group-display';
import { cardsMessages } from '../messages';
import type { CardGroup } from '../types';
import { DeckIcon } from './deck-icon';
import './card-group-list.css';

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

// Group folders (proposal D): "Todas" filters the library below, a group
// folder opens that group's own screen, and the dashed folder starts a new
// group.
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
      <h2 className="sr-only" id="deck-groups-title">
        {messages.groupsTitle}
      </h2>
      <div
        aria-label={messages.groupsLabel}
        className="deck-groups__list"
        role="group"
      >
        <FolderTile
          aria-label={`${messages.allGroups} · ${messages.groupMeta(totalCards, totalDue)}`}
          count={totalCards}
          icon={<DeckIcon name="stack" size={24} />}
          onClick={onSelectAll}
          pressed={activeGroupId === ALL_GROUPS_ID}
          subtitle={messages.allGroupsHint}
          title={messages.allGroups}
        />
        {tiles.map(({ group, cardCount, dueCount }) => (
          <FolderTile
            aria-label={`${getGroupDisplayName(group)} · ${messages.groupMeta(cardCount, dueCount)}`}
            count={cardCount}
            icon={<DeckIcon name="stack" size={24} />}
            key={group.id}
            onClick={() => onOpenGroup(group.id)}
            subtitle={getGroupDisplayDescription(group) || undefined}
            title={getGroupDisplayName(group)}
            tone={group.tone}
          />
        ))}
        <FolderTile
          icon={<DeckIcon name="plus" size={26} />}
          onClick={onAddGroup}
          title={messages.newGroup}
          variant="add"
        />
      </div>
    </section>
  );
}
