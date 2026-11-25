'use client';

import { ChevronLeft, ChevronRight, Folder, Trash2 } from 'lucide-react';
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
import { getPageNumbers, paginateItems } from '../hooks/pagination';
import { useCompactViewport } from '../hooks/use-compact-viewport';
import { getGroupDisplayName } from '../group-display';
import { cardsMessages } from '../messages';
import type { CardScheduleMap } from '../scheduling/types';
import type { CardGroup, VocabularyCard } from '../types';
import { GroupAddActions } from './group-add-actions';
import { FolderMenu } from './folder-menu';
import { GroupEmptyState } from './group-empty-state';
import { SelectionActionBar } from './selection-action-bar';
import { VocabularyCardItem } from './vocabulary-card-item';
import { translateText } from '@/lib/i18n/locale';
import { cn } from '@/lib/utils';
import './cards-library.css';

const messages = cardsMessages.overview;
const CARDS_PAGE_SIZE = 12;
// Phones show a short list that grows by steps instead of numbered pages.
const COMPACT_INITIAL_COUNT = 4;
const COMPACT_STEP = 10;

// Dot colors follow the due dot of the cards: coral is due today, violet is
// due this week, mint is safe. Read at render time so the labels follow the
// selected language.
function getStatusOptions(counts: CardStatusCounts) {
  const labels = messages.statusFilters;
  return [
    { value: 'all', label: labels.all, count: counts.all },
    { value: 'due', label: labels.due, count: counts.due, dot: 'coral' },
    { value: 'week', label: labels.week, count: counts.week, dot: 'brand' },
    { value: 'safe', label: labels.safe, count: counts.safe, dot: 'mint' }
  ] as const satisfies readonly {
    value: CardStatusFilter;
    label: string;
    count: number;
    dot?: 'coral' | 'brand' | 'mint';
  }[];
}

export type ActiveGroupStats = {
  dueCount: number;
  masteredPercent: number;
  isDeletable: boolean;
};

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
      <div className="deck-library__head">
        <nav
          aria-label={messages.locationLabel}
          className="deck-library__crumbs"
        >
          {activeGroup ? (
            <button
              className="deck-library__crumb-root"
              onClick={onShowAll}
              type="button"
            >
              <ChevronLeft aria-hidden="true" size={16} />
              {messages.title}
            </button>
          ) : (
            <span className="deck-library__crumb-root deck-library__crumb-root--current">
              {messages.title}
            </span>
          )}
          <span aria-hidden="true" className="deck-library__crumb-sep">
            /
          </span>
          <span aria-current="location" className="deck-library__crumb-here">
            <Folder
              aria-hidden="true"
              className="deck-library__crumb-icon"
              size={18}
            />
            {activeGroup ? (
              <span className="deck-library__crumb-kind">
                {messages.folderLabel}
              </span>
            ) : null}
            <h2 id="deck-library-title" title={groupTitle}>
              {groupTitle}
            </h2>
          </span>
          <span className="deck-library__meta">
            {messages.cardCount(statusCounts.all)}
          </span>
          {activeGroupStats ? (
            <span className="deck-library__chips">
              <span className="deck-library__chip">
                {messages.folderDueChip(activeGroupStats.dueCount)}
              </span>
              <span className="deck-library__chip">
                {messages.folderMasteredChip(activeGroupStats.masteredPercent)}
              </span>
            </span>
          ) : null}
        </nav>
        <div className="deck-library__links">
          {activeGroup && activeGroupStats ? (
            <FolderMenu
              cardCount={statusCounts.all}
              group={activeGroup}
              isDeletable={activeGroupStats.isDeletable}
              onDelete={onDeleteGroup}
            />
          ) : null}
          <button
            className={cn(
              actionPillClass('tertiary', 'md', 'mint'),
              'deck-library__manage'
            )}
            type="button"
            disabled={!canDeleteCards || cards.length === 0}
            inert={isManaging}
            onClick={startManaging}
          >
            {messages.manageCards}
          </button>
        </div>
      </div>
      <div className="deck-library__toolbar">
        <SegmentedToggle
          ariaLabel={messages.statusFiltersLabel}
          className="deck-library__status"
          onChange={changeStatus}
          options={getStatusOptions(statusCounts)}
          value={activeStatus}
          variant="filter"
        />
        <SelectField
          className="deck-library__type"
          id="deck-type-select"
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
      {isUnfilteredGroup && cards.length > 0 && (
        <div className="deck-library__group-actions">
          <GroupAddActions variant="header" onAdd={onAddCard} />
        </div>
      )}
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
                actionPillClass('secondary', 'md', 'mint'),
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
              {messages.showMore(Math.min(COMPACT_STEP, compactRemaining))}
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
