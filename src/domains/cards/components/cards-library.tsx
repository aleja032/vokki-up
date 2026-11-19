'use client';

import { ChevronLeft, ChevronRight, ListChecks, Trash2 } from 'lucide-react';
import { useState, type ReactNode } from 'react';
import { ConfirmDialog } from '@/components/overlay/confirm-dialog';
import { Chip } from '@/components/ui/chip';
import { SearchField } from '@/components/ui/search-field';
import { paginateItems } from '../hooks/pagination';
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
const CARDS_PAGE_SIZE = 9;

type CardsLibraryProps = {
  cards: VocabularyCard[];
  groups: CardGroup[];
  schedules: CardScheduleMap;
  now: Date;
  activeGroup?: CardGroup;
  categories: readonly string[];
  activeCategory: string;
  searchText: string;
  canDeleteCards: boolean;
  onSearchChange: (value: string) => void;
  onCategoryChange: (category: string) => void;
  onDeleteCards: (cardIds: readonly string[]) => void;
  onAddCard: () => void;
  /** Group chips rendered in the toolbar, next to the search field. */
  groupFilters?: ReactNode;
};

export function CardsLibrary({
  cards,
  groups,
  schedules,
  now,
  activeGroup,
  categories,
  activeCategory,
  searchText,
  canDeleteCards,
  onSearchChange,
  onCategoryChange,
  onDeleteCards,
  onAddCard,
  groupFilters
}: CardsLibraryProps) {
  const [requestedPage, setRequestedPage] = useState({ key: '', page: 1 });
  const [isManaging, setIsManaging] = useState(false);
  const [selectedCardIds, setSelectedCardIds] = useState<string[]>([]);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const pageContextKey = JSON.stringify([
    activeGroup?.id ?? null,
    activeCategory,
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
    activeCategory === messages.allCategories;
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
      <div className="deck-library__tools">
        <div className="deck-library__toolbar">
          {groupFilters}
          <SearchField
            className="deck-library__search"
            id="deck-search-input"
            label={messages.searchLabel}
            onChange={changeSearch}
            placeholder={messages.searchPlaceholder}
            value={searchText}
          />
        </div>
        <div
          className="deck-filters"
          role="group"
          aria-label={messages.filtersLabel}
        >
          {categories.map(category => (
            <Chip
              key={category}
              onClick={() => changeCategory(category)}
              pressed={activeCategory === category}
              title={translateText(category)}
            >
              {translateText(category)}
            </Chip>
          ))}
        </div>
      </div>
      <div className="deck-library__heading">
        <h2 id="deck-library-title">
          <span className="deck-library__title-compact">
            {activeGroup
              ? messages.libraryTitleGroup(getGroupDisplayName(activeGroup))
              : messages.libraryTitleAll}
          </span>
          <span className="deck-library__title-wide">
            {messages.libraryTitleWide}
          </span>
        </h2>
        <button
          className="deck-library__manage"
          type="button"
          disabled={!canDeleteCards || cards.length === 0}
          inert={isManaging}
          onClick={startManaging}
        >
          <ListChecks aria-hidden="true" size={18} />
          {messages.manageCards}
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
        <nav className="deck-pagination" aria-label={messages.pagination.label}>
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
            <span>{messages.pagination.previous}</span>
          </button>
          <span
            className="deck-pagination__status"
            aria-live="polite"
            aria-atomic="true"
          >
            {messages.pagination.status(page.page, page.pageCount)}
          </span>
          <button
            aria-label={messages.pagination.nextLabel}
            className="deck-pagination__button"
            disabled={page.page === page.pageCount}
            onClick={() =>
              setRequestedPage({ key: pageContextKey, page: page.page + 1 })
            }
            type="button"
          >
            <span>{messages.pagination.next}</span>
            <ChevronRight aria-hidden="true" size={18} />
          </button>
        </nav>
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
