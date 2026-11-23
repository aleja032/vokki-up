'use client';

import Link from 'next/link';
import { Globe, Plus } from 'lucide-react';
import { LocationCrumb } from '@/components/ui/location-crumb';
import { useMemo, useState } from 'react';
import { Chip } from '@/components/ui/chip';
import { SearchField } from '@/components/ui/search-field';
import {
  ALL_WORD_LIBRARY_CATEGORIES,
  ALL_WORD_LIBRARY_LEVELS,
  countEntriesByCategory,
  countEntriesByLevel,
  filterCatalogEntries,
  normalizeCatalogTerm,
  WORD_LIBRARY_CATEGORIES,
  WORD_LIBRARY_LEVELS,
  wordLibraryCatalog
} from '../word-library/catalog';
import type {
  WordLibraryCategory,
  WordLibraryEntry,
  WordLibraryLevelFilter
} from '../word-library/catalog';
import { wordLibraryMessages } from '../word-library/messages';
import {
  getWorldDisplayName,
  WORLDS,
  type WorldSummary
} from '../word-library/worlds';
import { SelectionActionBar } from './selection-action-bar';
import { WordLibraryEntryCard } from './word-library-entry-card';
import { WorldBanner } from './world-banner';
import { WorldStages } from './world-stages';
import './word-library.css';

const messages = wordLibraryMessages;

const LEVEL_OPTIONS: readonly WordLibraryLevelFilter[] = [
  ALL_WORD_LIBRARY_LEVELS,
  ...WORD_LIBRARY_LEVELS
];

type CategoryFilter = WordLibraryCategory | typeof ALL_WORD_LIBRARY_CATEGORIES;

const CATEGORY_OPTIONS: readonly CategoryFilter[] = [
  ALL_WORD_LIBRARY_CATEGORIES,
  ...WORD_LIBRARY_CATEGORIES
];

function getCategoryLabel(item: CategoryFilter) {
  if (item === ALL_WORD_LIBRARY_CATEGORIES) return messages.allCategories;
  const world = WORLDS.find(candidate => candidate.category === item);
  return world ? getWorldDisplayName(world) : item;
}

export const WORD_LIBRARY_PAGE_SIZE = 24;

export function paginateWordLibraryEntries<T>(
  entries: readonly T[],
  page: number,
  pageSize = WORD_LIBRARY_PAGE_SIZE
) {
  const start = (Math.max(1, page) - 1) * pageSize;
  return entries.slice(start, start + pageSize);
}

export function sortWordLibraryEntries<T extends { term: string }>(
  entries: readonly T[],
  existingTerms: ReadonlySet<string>
) {
  return [...entries].sort(
    (a, b) =>
      Number(existingTerms.has(normalizeCatalogTerm(a.term))) -
      Number(existingTerms.has(normalizeCatalogTerm(b.term)))
  );
}

type AddResult = { added: readonly unknown[]; duplicates: readonly unknown[] };

type WordLibraryBrowserProps = {
  /** The world being browsed; without it the whole catalog is listed. */
  world?: WorldSummary;
  existingTerms: ReadonlySet<string>;
  onAddEntries: (entries: readonly WordLibraryEntry[]) => AddResult;
};

export function WordLibraryBrowser({
  world,
  existingTerms,
  onAddEntries
}: WordLibraryBrowserProps) {
  const [category, setCategory] = useState<CategoryFilter>(
    world?.category ?? ALL_WORD_LIBRARY_CATEGORIES
  );
  const [level, setLevel] = useState<WordLibraryLevelFilter>(
    ALL_WORD_LIBRARY_LEVELS
  );
  const [searchText, setSearchText] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [announcement, setAnnouncement] = useState('');
  const [page, setPage] = useState(1);
  // A world fixes the category; the whole-library view lets the user pick one.
  const activeCategory: CategoryFilter = world?.category ?? category;

  const filteredEntries = useMemo(
    () =>
      sortWordLibraryEntries(
        filterCatalogEntries(
          wordLibraryCatalog,
          activeCategory,
          searchText,
          level
        ),
        existingTerms
      ),
    [activeCategory, existingTerms, level, searchText]
  );
  const levelCounts = useMemo(
    () => countEntriesByLevel(wordLibraryCatalog, activeCategory),
    [activeCategory]
  );
  const categoryCounts = useMemo(
    () => countEntriesByCategory(wordLibraryCatalog, level),
    [level]
  );
  const hasActiveFilters =
    level !== ALL_WORD_LIBRARY_LEVELS ||
    (!world && category !== ALL_WORD_LIBRARY_CATEGORIES) ||
    searchText.trim() !== '';
  const pageCount = Math.max(
    1,
    Math.ceil(filteredEntries.length / WORD_LIBRARY_PAGE_SIZE)
  );
  const currentPage = Math.min(page, pageCount);
  const pageEntries = paginateWordLibraryEntries(filteredEntries, currentPage);
  const addableEntries = filteredEntries.filter(
    entry => !existingTerms.has(normalizeCatalogTerm(entry.term))
  );
  const addableIds = new Set(addableEntries.map(entry => entry.id));
  const activeSelection = selectedIds.filter(id => addableIds.has(id));
  const isAllSelected =
    addableEntries.length > 0 &&
    activeSelection.length === addableEntries.length;
  const selectedEntries = addableEntries.filter(entry =>
    activeSelection.includes(entry.id)
  );
  const searchPlaceholder = world
    ? messages.searchInWorld(getWorldDisplayName(world))
    : messages.searchPlaceholder;

  function resetSelection() {
    setPage(1);
    setSelectedIds([]);
    setAnnouncement('');
  }

  function changeLevel(next: WordLibraryLevelFilter) {
    resetSelection();
    setLevel(next);
  }

  function changeCategory(next: CategoryFilter) {
    resetSelection();
    setCategory(next);
  }

  function clearFilters() {
    resetSelection();
    setLevel(ALL_WORD_LIBRARY_LEVELS);
    setCategory(world?.category ?? ALL_WORD_LIBRARY_CATEGORIES);
    setSearchText('');
  }

  function startAdding() {
    setAnnouncement('');
    setIsAdding(true);
  }

  function stopAdding() {
    setIsAdding(false);
    setSelectedIds([]);
  }

  function toggleEntry(entryId: string) {
    setSelectedIds(current =>
      current.includes(entryId)
        ? current.filter(id => id !== entryId)
        : [...current, entryId]
    );
  }

  function toggleAllSelected() {
    setSelectedIds(isAllSelected ? [] : addableEntries.map(entry => entry.id));
  }

  function addSelectedEntries() {
    if (selectedEntries.length === 0) return;
    const result = onAddEntries(selectedEntries);
    const parts = [
      result.added.length > 0 && messages.addedPart(result.added.length),
      result.duplicates.length > 0 &&
        messages.duplicatesPart(result.duplicates.length)
    ].filter(Boolean);
    setAnnouncement(parts.join('. '));
    stopAdding();
  }

  return (
    <div className="word-library accent-violet" data-adding={isAdding}>
      {world ? (
        <>
          <WorldBanner world={world} />
          <WorldStages activeLevel={level} world={world} />
        </>
      ) : (
        <header className="word-library__header">
          <LocationCrumb
            ariaLabel={messages.locationLabel}
            currentLabel={messages.title}
            icon={<Globe size={16} />}
            rootHref="/cards/word-library"
            rootLabel={messages.backToWorlds}
          />
          <h1 id="word-library-title">{messages.title}</h1>
          <p>{messages.summary}</p>
        </header>
      )}

      <section
        className="word-library__browser"
        aria-labelledby="word-library-title"
      >
        <div className="word-library__tools">
          <div className="word-library__search-row">
            <SearchField
              className="word-library__search"
              id="word-library-search"
              label={messages.searchLabel}
              onChange={value => {
                setPage(1);
                setSearchText(value);
              }}
              placeholder={searchPlaceholder}
              shape="soft"
              value={searchText}
            />
            <button
              className="word-library__add-toggle"
              type="button"
              inert={isAdding}
              onClick={startAdding}
            >
              <Plus aria-hidden="true" size={18} />
              {messages.addMode}
            </button>
          </div>
          <div className="word-library__filters">
            <div
              className="word-library__chips"
              role="group"
              aria-label={messages.levelsLabel}
            >
              {LEVEL_OPTIONS.map(item => (
                <Chip
                  key={item}
                  onClick={() => changeLevel(item)}
                  pressed={level === item}
                >
                  {`${item === ALL_WORD_LIBRARY_LEVELS ? messages.allLevels : messages.levelNames[item]} · ${levelCounts[item]}`}
                </Chip>
              ))}
            </div>
            {!world && (
              <div
                className="word-library__chips"
                role="group"
                aria-label={messages.categoriesLabel}
              >
                {CATEGORY_OPTIONS.map(item => (
                  <Chip
                    key={item}
                    onClick={() => changeCategory(item)}
                    pressed={category === item}
                  >
                    {`${getCategoryLabel(item)} · ${categoryCounts[item]}`}
                  </Chip>
                ))}
              </div>
            )}
          </div>
          <div className="word-library__controls-row">
            <p className="word-library__count" aria-live="polite">
              {messages.resultCount(filteredEntries.length)}
            </p>
            {filteredEntries.length > 0 && (
              <nav
                className="word-library__pagination"
                aria-label={messages.paginationLabel}
              >
                <button
                  type="button"
                  onClick={() => setPage(current => Math.max(1, current - 1))}
                  disabled={currentPage === 1}
                >
                  {messages.previousPage}
                </button>
                <span aria-live="polite">
                  {messages.pageStatus(currentPage, pageCount)}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setPage(current => Math.min(pageCount, current + 1))
                  }
                  disabled={currentPage === pageCount}
                >
                  {messages.nextPage}
                </button>
              </nav>
            )}
          </div>
          <p
            className="word-library__announcement"
            role="status"
            aria-live="polite"
          >
            {announcement}
            {announcement ? (
              <>
                {' '}
                <Link className="word-library__announcement-link" href="/cards">
                  {messages.viewInDeck}
                </Link>
              </>
            ) : null}
          </p>
        </div>

        <div className="word-library__list">
          {pageEntries.map(entry => (
            <WordLibraryEntryCard
              key={entry.id}
              entry={entry}
              isAdding={isAdding}
              isSelected={activeSelection.includes(entry.id)}
              isAlreadyAdded={existingTerms.has(
                normalizeCatalogTerm(entry.term)
              )}
              onToggleSelect={toggleEntry}
            />
          ))}
        </div>
        {filteredEntries.length === 0 && (
          <div className="word-library__empty">
            <p>{hasActiveFilters ? messages.emptyFiltered : messages.empty}</p>
            {hasActiveFilters && (
              <button type="button" onClick={clearFilters}>
                {messages.clearFilters}
              </button>
            )}
          </div>
        )}
        {isAdding && (
          <SelectionActionBar
            label={messages.addBarLabel}
            summary={messages.selectedWords(activeSelection.length)}
            toggleAllLabel={
              isAllSelected ? messages.clearSelection : messages.selectAll
            }
            toggleAllDisabled={addableEntries.length === 0}
            cancelLabel={messages.cancelAdd}
            primaryLabel={messages.addAction(activeSelection.length)}
            primaryIcon={<Plus aria-hidden="true" size={18} />}
            primaryDisabled={activeSelection.length === 0}
            onToggleAll={toggleAllSelected}
            onCancel={stopAdding}
            onPrimary={addSelectedEntries}
          />
        )}
      </section>
    </div>
  );
}
