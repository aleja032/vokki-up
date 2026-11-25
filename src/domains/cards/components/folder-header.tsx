'use client';

import { ChevronLeft, Folder, FolderOpen, Plus } from 'lucide-react';
import { ActionPill, actionPillClass } from '@/components/ui/action-pill';
import { cn } from '@/lib/utils';
import { displayTone } from '../group-colors';
import { getGroupDisplayName } from '../group-display';
import { cardsMessages } from '../messages';
import type { CardGroup } from '../types';
import type { GroupPatch } from '../update-group';
import { FolderMenu } from './folder-menu';
import './folder-header.css';

const messages = cardsMessages.overview;

export type ActiveGroupStats = {
  dueCount: number;
  masteredPercent: number;
  isDeletable: boolean;
};

type FolderHeaderProps = {
  /** The open folder; absent for "Todas las carpetas". */
  group?: CardGroup;
  /** Cards of the folder (or of the whole deck). */
  cardCount: number;
  /** Quick stats and delete rule of the open folder. */
  stats?: ActiveGroupStats;
  /** Names the open folder cannot take when renamed. */
  otherGroupNames: readonly string[];
  /** False while there is nothing to manage. */
  canManage: boolean;
  isManaging: boolean;
  /** False when the empty state already offers the add actions. */
  canAddCard?: boolean;
  onShowAll: () => void;
  onAddCard: () => void;
  onManage: () => void;
  onUpdateGroup: (groupId: string, patch: GroupPatch) => void;
  onDeleteGroup: (groupId: string) => void;
};

// Where you are in Mi mazo. Inside a folder it is a card in the folder color:
// a way out ("Todas las carpetas"), the folder as the heading with a summary and
// its menu, and the actions that act on this folder. For the whole deck it is a
// lighter header (title and total, no folder tools).
export function FolderHeader({
  group,
  cardCount,
  stats,
  otherGroupNames,
  canManage,
  isManaging,
  canAddCard = true,
  onShowAll,
  onAddCard,
  onManage,
  onUpdateGroup,
  onDeleteGroup
}: FolderHeaderProps) {
  const title = group ? getGroupDisplayName(group) : messages.allFoldersTitle;
  const summary =
    group && stats
      ? messages.folderSummary(cardCount, stats.dueCount, stats.masteredPercent)
      : messages.cardCount(cardCount);
  const manageButton = (
    <button
      className={cn(
        actionPillClass('tertiary', 'md', 'mint'),
        'folder-header__manage'
      )}
      disabled={!canManage}
      inert={isManaging}
      onClick={onManage}
      type="button"
    >
      {messages.manageCards}
    </button>
  );

  return (
    <header
      className="folder-header"
      data-folder-color={group ? displayTone(group.tone) : undefined}
      data-scope={group ? 'folder' : 'all'}
    >
      {group ? (
        <nav aria-label={messages.locationLabel} className="folder-header__nav">
          <button
            aria-label={messages.backToAllLabel}
            className="folder-header__back"
            onClick={onShowAll}
            type="button"
          >
            <ChevronLeft aria-hidden="true" size={18} />
            {messages.allFoldersTitle}
          </button>
        </nav>
      ) : null}
      <div className="folder-header__main">
        <span
          aria-hidden="true"
          className={cn(
            'folder-header__chip',
            group && 'folder-header__chip--colored'
          )}
        >
          {group ? <Folder size={24} /> : <FolderOpen size={24} />}
        </span>
        <div className="folder-header__copy">
          {group ? (
            <span className="folder-header__kind">{messages.folderLabel}</span>
          ) : null}
          <h2 id="deck-library-title" title={title}>
            {title}
          </h2>
          <p className="folder-header__summary">{summary}</p>
        </div>
        {group && stats ? (
          <FolderMenu
            cardCount={cardCount}
            group={group}
            isDeletable={stats.isDeletable}
            onDelete={onDeleteGroup}
            onUpdate={onUpdateGroup}
            otherGroupNames={otherGroupNames}
          />
        ) : null}
        {group ? null : manageButton}
      </div>
      {group ? (
        <div className="folder-header__actions">
          {canAddCard ? (
            <ActionPill
              className="folder-header__add"
              icon={<Plus size={18} strokeWidth={2.4} />}
              onClick={onAddCard}
              size="sm"
              tone="mint"
              variant="secondary"
            >
              {messages.addToFolder}
            </ActionPill>
          ) : null}
          {manageButton}
        </div>
      ) : null}
    </header>
  );
}
