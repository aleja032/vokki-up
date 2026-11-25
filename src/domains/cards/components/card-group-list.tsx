'use client';

import { FolderList } from '@/components/ui/folder-list';
import { ALL_GROUPS_ID } from '../hooks/use-cards-dashboard';
import { displayTone } from '../group-colors';
import { getGroupDisplayName } from '../group-display';
import { cardsMessages } from '../messages';
import type { CardGroup } from '../types';

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
  searchText: string;
  onSearchChange: (value: string) => void;
  onSelectGroup: (groupId: string) => void;
  onAddGroup: () => void;
};

// Folders of the deck (proposal D): "Todas" and each group filter the library
// next to the list; the last button starts a new group. The search narrows the
// list of folders by name.
export function CardGroupList({
  tiles,
  totalCards,
  totalDue,
  activeGroupId,
  searchText,
  onSearchChange,
  onSelectGroup,
  onAddGroup
}: CardGroupListProps) {
  const query = searchText.trim().toLocaleLowerCase();
  const visibleTiles = tiles.filter(
    ({ group }) =>
      !query || getGroupDisplayName(group).toLocaleLowerCase().includes(query)
  );

  return (
    <FolderList
      addLabel={messages.newGroup}
      collapseLabel={messages.viewFewerFolders}
      emptyLabel={messages.noFolders}
      hintLink={{ href: '/cards/word-library', label: messages.exploreWorlds }}
      expandLabel={
        tiles.length > 1 ? messages.viewAllFolders(tiles.length) : undefined
      }
      isEmpty={query !== '' && visibleTiles.length === 0}
      items={[
        {
          id: ALL_GROUPS_ID,
          label: messages.allGroups,
          count: totalCards,
          countLabel: messages.cardCount(totalCards),
          dueLabel: totalDue > 0 ? messages.folderDue(totalDue) : undefined,
          pressed: activeGroupId === ALL_GROUPS_ID,
          ariaLabel: `${messages.allGroups} · ${messages.groupMeta(totalCards, totalDue)}`,
          onSelect: () => onSelectGroup(ALL_GROUPS_ID)
        },
        ...visibleTiles.map(({ group, cardCount, dueCount }) => ({
          id: group.id,
          label: getGroupDisplayName(group),
          count: cardCount,
          countLabel: messages.cardCount(cardCount),
          dueLabel: dueCount > 0 ? messages.folderDue(dueCount) : undefined,
          pressed: activeGroupId === group.id,
          color: displayTone(group.tone),
          ariaLabel: `${getGroupDisplayName(group)} · ${messages.groupMeta(cardCount, dueCount)}`,
          onSelect: () => onSelectGroup(group.id)
        }))
      ]}
      listLabel={messages.groupsLabel}
      onAdd={onAddGroup}
      onSearchChange={onSearchChange}
      searchLabel={messages.folderSearchLabel}
      searchValue={searchText}
      title={messages.groupsTitle}
      total={tiles.length}
    />
  );
}
