'use client';

import { Plus } from 'lucide-react';
import { ALL_GROUPS_ID } from '../hooks/use-cards-dashboard';
import { displayTone } from '../group-colors';
import { getGroupDisplayName } from '../group-display';
import { cardsMessages } from '../messages';
import type { CardGroupTile } from './card-group-list';
import './folder-chip-row.css';

const messages = cardsMessages.overview;

type FolderChipRowProps = {
  tiles: CardGroupTile[];
  totalCards: number;
  totalDue: number;
  activeGroupId: string;
  onSelectGroup: (groupId: string) => void;
  onAddGroup: () => void;
};

// Phones: the folders as one row of compact chips that scrolls sideways ("Todas"
// first, one colored chip per folder, a "Carpeta" chip at the end that starts a
// new one). It replaces the side list of wide screens, which is hidden on
// phones; the heading stays for assistive tech.
export function FolderChipRow({
  tiles,
  totalCards,
  totalDue,
  activeGroupId,
  onSelectGroup,
  onAddGroup
}: FolderChipRowProps) {
  const chips = [
    {
      id: ALL_GROUPS_ID,
      label: messages.allGroups,
      count: totalCards,
      due: totalDue,
      color: undefined
    },
    ...tiles.map(({ group, cardCount, dueCount }) => ({
      id: group.id,
      label: getGroupDisplayName(group),
      count: cardCount,
      due: dueCount,
      color: displayTone(group.tone)
    }))
  ];

  return (
    <section className="folder-chips">
      <h2 className="sr-only">{messages.groupsTitle}</h2>
      <nav aria-label={messages.groupsLabel} className="folder-chips__row">
        {chips.map(chip => (
          <button
            aria-label={`${chip.label} · ${messages.groupMeta(chip.count, chip.due)}`}
            aria-pressed={activeGroupId === chip.id}
            className="folder-chips__chip"
            data-folder-color={chip.color}
            key={chip.id}
            onClick={() => onSelectGroup(chip.id)}
            type="button"
          >
            <span aria-hidden="true" className="folder-chips__dot" />
            <span className="folder-chips__label">{chip.label}</span>
            <span className="folder-chips__count">{chip.count}</span>
          </button>
        ))}
        <button
          aria-label={messages.newGroup}
          className="folder-chips__add"
          onClick={onAddGroup}
          type="button"
        >
          <Plus aria-hidden="true" size={16} strokeWidth={2.6} />
          {messages.addFolderChip}
        </button>
      </nav>
    </section>
  );
}
