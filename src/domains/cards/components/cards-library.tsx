'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useId, useState } from 'react';
import { paginateItems } from '../hooks/pagination';
import { cardsMessages } from '../messages';
import type { CardScheduleMap } from '../scheduling/types';
import type { CardGroup, VocabularyCard } from '../types';
import { DeckIcon } from './deck-icon';
import { VocabularyCardItem } from './vocabulary-card-item';
import { translateText } from '@/lib/i18n/locale';

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
  onDeleteCards
}: CardsLibraryProps) {
  const [requestedPage, setRequestedPage] = useState({ key: '', page: 1 });
  const [isManaging, setIsManaging] = useState(false);
  const [selectedCardIds, setSelectedCardIds] = useState<string[]>([]);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const confirmationTitleId = useId();
  const confirmationDescriptionId = useId();
  const pageContextKey = JSON.stringify([
    activeGroup?.id ?? null,
    activeCategory,
    searchText
  ]);
  const currentPage =
    requestedPage.key === pageContextKey ? requestedPage.page : 1;
  const page = paginateItems(cards, currentPage, CARDS_PAGE_SIZE);

  function changeSearch(value: string) {
    setRequestedPage({ key: pageContextKey, page: 1 });
    onSearchChange(value);
  }

  function changeCategory(category: string) {
    setRequestedPage({ key: pageContextKey, page: 1 });
    onCategoryChange(category);
  }

  function toggleManaging() {
    setIsManaging(current => {
      if (current) {
        setSelectedCardIds([]);
        setIsConfirmingDelete(false);
      }
      return !current;
    });
  }

  function toggleCardSelection(cardId: string) {
    setSelectedCardIds(current =>
      current.includes(cardId)
        ? current.filter(id => id !== cardId)
        : [...current, cardId]
    );
  }

  function confirmDelete() {
    onDeleteCards(selectedCardIds);
    setSelectedCardIds([]);
    setIsConfirmingDelete(false);
    setIsManaging(false);
  }

  return (
    <section className="deck-library" aria-labelledby="deck-library-title">
      <div className="deck-library__heading">
        <h2 id="deck-library-title">
          <span className="deck-library__title-compact">
            {activeGroup
              ? messages.libraryTitleGroup(activeGroup.name)
              : messages.libraryTitleAll}
          </span>
          <span className="deck-library__title-wide">
            {messages.libraryTitleWide}
          </span>
        </h2>
        <button
          className="deck-library__manage"
          type="button"
          aria-pressed={isManaging}
          disabled={!canDeleteCards || cards.length === 0}
          onClick={toggleManaging}
        >
          {isManaging ? messages.manageDone : messages.manageCards}
        </button>
      </div>
      {isManaging && (
        <div className="deck-library__manage-bar">
          <span aria-live="polite">
            {messages.selectedCards(selectedCardIds.length)}
          </span>
          <button
            className="deck-library__delete-selected"
            disabled={selectedCardIds.length === 0}
            onClick={() => setIsConfirmingDelete(true)}
            type="button"
          >
            {messages.deleteSelected}
          </button>
        </div>
      )}
      {isConfirmingDelete && (
        <div
          className="deck-confirm deck-library__confirm"
          role="alertdialog"
          aria-labelledby={confirmationTitleId}
          aria-describedby={confirmationDescriptionId}
        >
          <div className="deck-confirm__copy">
            <span id={confirmationTitleId}>
              {messages.deleteSelectedTitle(selectedCardIds.length)}
            </span>
            <span id={confirmationDescriptionId}>
              {messages.deleteSelectedBody}
            </span>
          </div>
          <div className="deck-confirm__actions">
            <button
              onClick={() => setIsConfirmingDelete(false)}
              type="button"
            >
              {messages.cardDeleteCancel}
            </button>
            <button
              className="deck-confirm__danger"
              onClick={confirmDelete}
              type="button"
            >
              {messages.deleteSelected}
            </button>
          </div>
        </div>
      )}
      <div className="deck-library__tools">
        <div className="deck-search">
          <label className="sr-only" htmlFor="deck-search-input">
            {messages.searchLabel}
          </label>
          <span className="deck-search__icon">
            <DeckIcon name="search" />
          </span>
          <input
            id="deck-search-input"
            type="search"
            placeholder={messages.searchPlaceholder}
            value={searchText}
            onChange={event => changeSearch(event.target.value)}
          />
        </div>
        <div
          className="deck-filters"
          role="group"
          aria-label={messages.filtersLabel}
        >
          {categories.map(category => (
            <button
              className="deck-filter"
              type="button"
              key={category}
              title={translateText(category)}
              aria-pressed={activeCategory === category}
              onClick={() => changeCategory(category)}
            >
              {translateText(category)}
            </button>
          ))}
        </div>
      </div>
      <div className="deck-library__grid">
        {page.items.map(card => (
          <VocabularyCardItem
            key={card.id}
            card={card}
            group={groups.find(group => group.id === card.groupId)}
            schedule={schedules[card.id]}
            now={now}
            isManaging={isManaging}
            isSelected={selectedCardIds.includes(card.id)}
            onToggleSelect={toggleCardSelection}
          />
        ))}
      </div>
      {cards.length === 0 && (
        <p className="deck-library__empty">{messages.emptyFilter}</p>
      )}
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
    </section>
  );
}
