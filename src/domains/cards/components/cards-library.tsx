'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { paginateItems } from '../hooks/pagination';
import { cardsMessages } from '../messages';
import type { CardScheduleMap } from '../scheduling/types';
import type { CardGroup, VocabularyCard } from '../types';
import { DeckIcon } from './deck-icon';
import { VocabularyCardItem } from './vocabulary-card-item';

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
  onSearchChange: (value: string) => void;
  onCategoryChange: (category: string) => void;
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
  onSearchChange,
  onCategoryChange
}: CardsLibraryProps) {
  const [requestedPage, setRequestedPage] = useState({ key: '', page: 1 });
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

  return (
    <section className="deck-library" aria-labelledby="deck-library-title">
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
              title={category}
              aria-pressed={activeCategory === category}
              onClick={() => changeCategory(category)}
            >
              {category}
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
          />
        ))}
      </div>
      {cards.length === 0 && (
        <p className="deck-library__empty">{messages.emptyFilter}</p>
      )}
      {page.pageCount > 1 && (
        <nav className="deck-pagination" aria-label="Paginación de tarjetas">
          <button
            aria-label="Página anterior"
            className="deck-pagination__button"
            disabled={page.page === 1}
            onClick={() =>
              setRequestedPage({ key: pageContextKey, page: page.page - 1 })
            }
            type="button"
          >
            <ChevronLeft aria-hidden="true" size={18} />
            <span>Anterior</span>
          </button>
          <span
            className="deck-pagination__status"
            aria-live="polite"
            aria-atomic="true"
          >
            Página {page.page} de {page.pageCount}
          </span>
          <button
            aria-label="Página siguiente"
            className="deck-pagination__button"
            disabled={page.page === page.pageCount}
            onClick={() =>
              setRequestedPage({ key: pageContextKey, page: page.page + 1 })
            }
            type="button"
          >
            <span>Siguiente</span>
            <ChevronRight aria-hidden="true" size={18} />
          </button>
        </nav>
      )}
    </section>
  );
}
