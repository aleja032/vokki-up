'use client';

import { Plus } from 'lucide-react';
import { Chip } from '@/components/ui/chip';
import { ALL_GROUPS_ID } from '../hooks/use-cards-dashboard';
import { getGroupDisplayName } from '../group-display';
import { cardsMessages } from '../messages';
import type { CardGroup } from '../types';
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

// Group chips (proposal D): "Todas" filters the library below, a group chip
// opens that group's own screen, and the dashed chip starts a new group.
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
        <Chip
          onClick={onSelectAll}
          pressed={activeGroupId === ALL_GROUPS_ID}
          title={messages.groupMeta(totalCards, totalDue)}
        >
          {`${messages.allGroups} · ${totalCards}`}
        </Chip>
        {tiles.map(({ group, cardCount, dueCount }) => (
          <Chip
            key={group.id}
            onClick={() => onOpenGroup(group.id)}
            title={`${getGroupDisplayName(group)} · ${messages.groupMeta(cardCount, dueCount)}`}
          >
            {`${getGroupDisplayName(group)} · ${cardCount}`}
          </Chip>
        ))}
        <Chip
          aria-label={messages.newGroup}
          icon={<Plus size={18} strokeWidth={2.6} />}
          onClick={onAddGroup}
          title={messages.newGroup}
          variant="add"
        />
      </div>
    </section>
  );
}
