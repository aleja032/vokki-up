'use client';

import {
  ChevronLeft,
  ChevronRight,
  ListChecks,
  SlidersHorizontal,
  Trash2
} from 'lucide-react';
import { useState } from 'react';
import { ConfirmDialog } from '@/components/overlay/confirm-dialog';
import { actionPillClass } from '@/components/ui/action-pill';
import { SearchField } from '@/components/ui/search-field';
import { SegmentedToggle } from '@/components/ui/segmented-toggle';
import { SelectField } from '@/components/ui/select-field';
import {
  ALL_CARD_STATUSES,
  type CardStatusCounts,
  type CardStatusFilter
} from '../card-status';
import { getStatusOptions } from '../status-filter-options';
import { getPageNumbers, paginateItems } from '../hooks/pagination';
import { useCompactViewport } from '../hooks/use-compact-viewport';
import { getGroupDisplayName } from '../group-display';
import { cardsMessages } from '../messages';
import type { CardScheduleMap } from '../scheduling/types';
import type { CardGroup, VocabularyCard } from '../types';
import type { GroupPatch } from '../update-group';
import { FolderHeader, type ActiveGroupStats } from './folder-header';
import { GroupEmptyState } from './group-empty-state';
import { SelectionActionBar } from './selection-action-bar';
import { VocabularyCardItem } from './vocabulary-card-item';
import { translateText } from '@/lib/i18n/locale';
import { cn } from '@/lib/utils';
import './cards-library.css';

const messages = cardsMessages.overview;
const CARDS_PAGE_SIZE = 12;
// Phones show a short list that grows by steps instead of numbered pages.
const COMPACT_INITIAL_COUNT = 8;
const COMPACT_STEP = 10;

export type { ActiveGroupStats };

type CardsLibraryProps = {
  cards: VocabularyCard[];
  schedules: CardScheduleMap;
  now: Date;
  activeGroup?: CardGroup;
  /** Quick stats and delete rule of the active folder. */
  activeGroupStats?: ActiveGroupStats;
  categories: readonly string[];
  activeCategory: string;
  activeStatus: CardStatusFilter;
  statusCounts: CardStatusCounts;
  searchText: string;
  canDeleteCards: boolean;
  onSearchChange: (value: string) => void;
  onCategoryChange: (category: string) => void;
  onStatusChange: (status: CardStatusFilter) => void;
  onDeleteCards: (cardIds: readonly string[]) => void;
  onAddCard: () => void;
  /** Names the active folder cannot take when renamed. */
  otherGroupNames: readonly string[];
  /** Renames and/or recolors the active folder. */
  onUpdateGroup: (groupId: string, patch: GroupPatch) => void;
  /** Deletes the active folder (its cards move to "Otros"). */
  onDeleteGroup: (groupId: string) => void;
  /** Goes back from a folder to the whole deck. */
  onShowAll: () => void;
  /** Opens the editor of one card. */
  onEditCard: (cardId: string) => void;
};

export function CardsLibrary({
  cards,
  schedules,
  now,
  activeGroup,
  activeGroupStats,
  categories,
  activeCategory,
  activeStatus,
  statusCounts,
  searchText,
  canDeleteCards,
  onSearchChange,
  onCategoryChange,
  onStatusChange,
  onDeleteCards,
  onAddCard,
  otherGroupNames,
  onUpdateGroup,
  onDeleteGroup,
  onShowAll,
  onEditCard
}: CardsLibraryProps) {
  const isCompact = useCompactViewport();
  const [requestedPage, setRequestedPage] = useState({ key: '', page: 1 });
  const [revealed, setRevealed] = useState({ key: '', extra: 0 });
  const [isManaging, setIsManaging] = useState(false);
  const [selectedCardIds, setSelectedCardIds] = useState<string[]>([]);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const pageContextKey = JSON.stringify([
    activeGroup?.id ?? null,
    activeCategory,
    activeStatus,
    searchText
  ]);
  const currentPage =
    requestedPage.key === pageContextKey ? requestedPage.page : 1;
  const page = paginateItems(cards, currentPage, CARDS_PAGE_SIZE);
  const compactCount = Math.min(
    cards.length,
    COMPACT_INITIAL_COUNT +
      (revealed.key === pageContextKey ? revealed.extra : 0)
  );
  const compactRemaining = cards.length - compactCount;
  const shownCards = isCompact ? cards.slice(0, compactCount) : page.items;
  const visibleIds = new Set(cards.map(card => card.id));
  const activeSelection = selectedCardIds.filter(id => visibleIds.has(id));
  // A group view with no search or category filter: its add actions apply.
  const isUnfilteredGroup =
    Boolean(activeGroup) &&
    searchText.trim() === '' &&
    activeStatus === ALL_CARD_STATUSES &&
    activeCategory === categories[0];
  const groupTitle = activeGroup
    ? getGroupDisplayName(activeGroup)
    : messages.allFoldersTitle;
  const firstShown =
    cards.length === 0 ? 0 : (page.page - 1) * CARDS_PAGE_SIZE + 1;
  const lastShown = firstShown + page.items.length - 1;
  const hasSelection = activeSelection.length > 0;
  const isAllSelected =
    cards.length > 0 && activeSelection.length === cards.length;

  function changeSearch(value: string) {
    setRequestedPage({ key: pageContextKey, page: 1 });
    onSearchChange(value);
  }

  function changeCategory(category: string) {
    setRequestedPage({ key: pageContextKey, page: 1 });
    onCategoryChange(category);
  }

  function changeStatus(status: CardStatusFilter) {
    setRequestedPage({ key: pageContextKey, page: 1 });
    onStatusChange(status);
  }

  function startManaging() {
    setIsManaging(true);
  }

  function stopManaging() {
    setIsManaging(false);
    setSelectedCardIds([]);
    setIsConfirmingDelete(false);
  }

  function toggleAllSelected() {
    setSelectedCardIds(isAllSelected ? [] : cards.map(card => card.id));
  }

  function toggleCardSelection(cardId: string) {
    setSelectedCardIds(current =>
      current.includes(cardId)
        ? current.filter(id => id !== cardId)
        : [...current, cardId]
    );
  }

  function confirmDelete() {
    onDeleteCards(activeSelection);
    stopManaging();
  }

  return (
    <section
      className="deck-library"
      aria-labelledby="deck-library-title"
      data-managing={isManaging}
    >
      <FolderHeader
        canManage={canDeleteCards && cards.length > 0}
        cardCount={statusCounts.all}
        group={activeGroup}
        isManaging={isManaging}
        onDeleteGroup={onDeleteGroup}
        onManage={startManaging}
        onShowAll={onShowAll}
        onUpdateGroup={onUpdateGroup}
        otherGroupNames={otherGroupNames}
        stats={activeGroupStats}
      />
      <div className="deck-library__toolbar">
        <div className="deck-library__find">
          <SearchField
            className="deck-library__search"
            id="deck-search-input"
            label={messages.searchLabel}
            onChange={changeSearch}
            placeholder={
              activeGroup
                ? messages.searchInGroup(groupTitle)
                : messages.searchPlaceholder
            }
            shape="soft"
            value={searchText}
          />
          <SelectField
            className="deck-library__type"
            icon={<SlidersHorizontal size={20} />}
            id="deck-type-select"
            isActive={activeCategory !== categories[0]}
            label={messages.typeLabel}
            onChange={changeCategory}
            options={categories.map(category => ({
              value: category,
              label:
                category === messages.allCategories
                  ? messages.allTypes
                  : translateText(category)
            }))}
            value={activeCategory}
          />
        </div>
        {!activeGroup && canDeleteCards && cards.length > 0 && !isManaging ? (
          <button
            aria-label={messages.manageCards}
            className="deck-library__manage"
            onClick={startManaging}
            type="button"
          >
            <ListChecks aria-hidden="true" size={20} />
          </button>
        ) : null}
        <SegmentedToggle
          ariaLabel={messages.statusFiltersLabel}
          className="deck-library__status"
          onChange={changeStatus}
          options={getStatusOptions(statusCounts)}
          value={activeStatus}
          variant="filter"
        />
      </div>
      <ConfirmDialog
        open={isConfirmingDelete}
        title={messages.deleteSelectedTitle(activeSelection.length)}
        description={messages.deleteSelectedBody}
        confirmLabel={messages.deleteAction}
        cancelLabel={messages.cardDeleteCancel}
        onConfirm={confirmDelete}
        onCancel={() => setIsConfirmingDelete(false)}
      />
      {cards.length > 0 && !isManaging ? (
        <p className="deck-library__hint">{messages.editHint}</p>
      ) : null}
      <div className="deck-library__grid">
        {shownCards.map(card => (
          <VocabularyCardItem
            key={card.id}
            card={card}
            schedule={schedules[card.id]}
            now={now}
            isManaging={isManaging}
            isSelected={activeSelection.includes(card.id)}
            onToggleSelect={toggleCardSelection}
            onEdit={onEditCard}
          />
        ))}
      </div>
      {cards.length === 0 &&
        (isUnfilteredGroup ? (
          <GroupEmptyState onAdd={onAddCard} />
        ) : (
          <p className="deck-library__empty">{messages.emptyFilter}</p>
        ))}
      {isCompact && cards.length > 0 && (
        <div className="deck-library__more">
          {compactRemaining > 0 && (
            <button
              className={cn(
                actionPillClass('tertiary', 'md', 'mint'),
                'deck-library__more-button'
              )}
              onClick={() =>
                setRevealed({
                  key: pageContextKey,
                  extra:
                    (revealed.key === pageContextKey ? revealed.extra : 0) +
                    COMPACT_STEP
                })
              }
              type="button"
            >
              {messages.showMoreCards}
            </button>
          )}
          <span
            aria-live="polite"
            aria-atomic="true"
            className="deck-library__shown"
          >
            {messages.shownOfTotal(compactCount, cards.length)}
          </span>
        </div>
      )}
      {!isCompact && page.pageCount > 1 && (
        <div className="deck-pagination">
          <span
            className="deck-pagination__status"
            aria-live="polite"
            aria-atomic="true"
          >
            {messages.pagination.showing(firstShown, lastShown, cards.length)}
          </span>
          <nav
            className="deck-pagination__pages"
            aria-label={messages.pagination.label}
          >
            <button
              aria-label={messages.pagination.previousLabel}
              className="deck-pagination__button"
              disabled={page.page === 1}
              onClick={() =>
                setRequestedPage({ key: pageContextKey, page: page.page - 1 })
              }
              type="button"
            >
              <ChevronLeft aria-hidden="true" size={18} />
            </button>
            {getPageNumbers(page.page, page.pageCount).map((item, index) =>
              item === 'gap' ? (
                <span
                  aria-hidden="true"
                  className="deck-pagination__gap"
                  key={`gap-${index}`}
                >
                  …
                </span>
              ) : (
                <button
                  aria-current={item === page.page ? 'page' : undefined}
                  aria-label={messages.pagination.pageLabel(item)}
                  className="deck-pagination__button"
                  key={item}
                  onClick={() =>
                    setRequestedPage({ key: pageContextKey, page: item })
                  }
                  type="button"
                >
                  {item}
                </button>
              )
            )}
            <button
              aria-label={messages.pagination.nextLabel}
              className="deck-pagination__button"
              disabled={page.page === page.pageCount}
              onClick={() =>
                setRequestedPage({ key: pageContextKey, page: page.page + 1 })
              }
              type="button"
            >
              <ChevronRight aria-hidden="true" size={18} />
            </button>
          </nav>
        </div>
      )}
      {isManaging && (
        <SelectionActionBar
          label={messages.manageCards}
          summary={messages.selectedCards(activeSelection.length)}
          toggleAllLabel={
            isAllSelected ? messages.clearSelection : messages.selectAll
          }
          cancelLabel={messages.cardDeleteCancel}
          primaryLabel={messages.deleteAction}
          primaryIcon={<Trash2 aria-hidden="true" size={18} />}
          primaryTone="danger"
          primaryDisabled={!hasSelection}
          onToggleAll={toggleAllSelected}
          onCancel={stopManaging}
          onPrimary={() => setIsConfirmingDelete(true)}
        />
      )}
    </section>
  );
}
