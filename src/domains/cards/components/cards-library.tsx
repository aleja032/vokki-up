'use client';

import {
  ChevronLeft,
  ChevronRight,
  Folder,
  ListChecks,
  Trash2
} from 'lucide-react';
import { useState } from 'react';
import { ConfirmDialog } from '@/components/overlay/confirm-dialog';
import { SearchField } from '@/components/ui/search-field';
import { SegmentedToggle } from '@/components/ui/segmented-toggle';
import { SelectField } from '@/components/ui/select-field';
import {
  ALL_CARD_STATUSES,
  type CardStatusCounts,
  type CardStatusFilter
} from '../card-status';
import { getPageNumbers, paginateItems } from '../hooks/pagination';
import { getGroupDisplayName } from '../group-display';
import { cardsMessages } from '../messages';
import type { CardScheduleMap } from '../scheduling/types';
import type { CardGroup, VocabularyCard } from '../types';
import { GroupAddActions } from './group-add-actions';
import { GroupEmptyState } from './group-empty-state';
import { SelectionActionBar } from './selection-action-bar';
import { VocabularyCardItem } from './vocabulary-card-item';
import { translateText } from '@/lib/i18n/locale';
import './cards-library.css';

const messages = cardsMessages.overview;
const CARDS_PAGE_SIZE = 12;

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

type CardsLibraryProps = {
  cards: VocabularyCard[];
  groups: CardGroup[];
  schedules: CardScheduleMap;
  now: Date;
  activeGroup?: CardGroup;
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
  /** Opens the screen of the active folder (rename, recolor, delete, review). */
  onOpenGroup: (groupId: string) => void;
};

export function CardsLibrary({
  cards,
  groups,
  schedules,
  now,
  activeGroup,
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
  onOpenGroup
}: CardsLibraryProps) {
  const [requestedPage, setRequestedPage] = useState({ key: '', page: 1 });
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
  const visibleIds = new Set(cards.map(card => card.id));
  const activeSelection = selectedCardIds.filter(id => visibleIds.has(id));
  // A group view with no search or category filter: its add actions apply.
  const isUnfilteredGroup =
    Boolean(activeGroup) &&
    searchText.trim() === '' &&
    activeStatus === ALL_CARD_STATUSES &&
    activeCategory === messages.allCategories;
  const groupTitle = activeGroup
    ? getGroupDisplayName(activeGroup)
    : messages.allGroups;
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
        <Folder
          aria-hidden="true"
          className="deck-library__crumb-icon"
          size={18}
        />
        <span className="deck-library__crumb">{messages.groupsTitle}</span>
        <span aria-hidden="true" className="deck-library__crumb-sep">
          /
        </span>
        <h2 id="deck-library-title">{groupTitle}</h2>
        <span className="deck-library__meta deck-library__meta--wide">
          {messages.cardCount(statusCounts.all)}
        </span>
        <span className="deck-library__meta deck-library__meta--compact">
          {messages.groupMeta(statusCounts.all, statusCounts.due)}
        </span>
        {activeGroup && (
          <button
            className="deck-library__open"
            onClick={() => onOpenGroup(activeGroup.id)}
            type="button"
          >
            {messages.openFolder}
          </button>
        )}
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
        <button
          className="deck-library__manage"
          type="button"
          disabled={!canDeleteCards || cards.length === 0}
          inert={isManaging}
          onClick={startManaging}
        >
          <ListChecks aria-hidden="true" size={18} />
          <span className="deck-library__manage-label">
            {messages.manageCards}
          </span>
        </button>
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
      <div className="deck-library__grid">
        {page.items.map(card => (
          <VocabularyCardItem
            key={card.id}
            card={card}
            group={groups.find(group => group.id === card.groupId)}
            schedule={schedules[card.id]}
            now={now}
            isManaging={isManaging}
            isSelected={activeSelection.includes(card.id)}
            onToggleSelect={toggleCardSelection}
          />
        ))}
      </div>
      {cards.length === 0 &&
        (isUnfilteredGroup ? (
          <GroupEmptyState onAdd={onAddCard} />
        ) : (
          <p className="deck-library__empty">{messages.emptyFilter}</p>
        ))}
      {page.pageCount > 1 && (
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
