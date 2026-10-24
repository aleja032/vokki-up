'use client';

import { cardsMessages } from '../messages';
import type { CardScheduleMap } from '../scheduling/types';
import type { CardGroup, VocabularyCard } from '../types';
import { DeckIcon } from './deck-icon';
import { VocabularyCardItem } from './vocabulary-card-item';

const messages = cardsMessages.overview;

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
            onChange={event => onSearchChange(event.target.value)}
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
              onClick={() => onCategoryChange(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
      <div className="deck-library__grid">
        {cards.map(card => (
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
    </section>
  );
}
