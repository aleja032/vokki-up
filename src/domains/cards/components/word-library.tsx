'use client';

import Link from 'next/link';
import {
  ArrowLeft,
  BookOpen,
  Check,
  LockKeyhole,
  Plus,
  Search
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { cn } from '@/lib/utils';
import {
  ALL_WORD_LIBRARY_CATEGORIES,
  ALL_WORD_LIBRARY_LEVELS,
  countEntriesByCategory,
  countEntriesByLevel,
  filterCatalogEntries,
  normalizeCatalogTerm,
  WORD_LIBRARY_CATEGORIES,
  WORD_LIBRARY_LEVEL_LABELS,
  WORD_LIBRARY_LEVELS,
  wordLibraryCatalog
} from '../word-library/catalog';
import type {
  WordLibraryCategory,
  WordLibraryEntry,
  WordLibraryLevelFilter
} from '../word-library/catalog';
import { useCardsDashboard } from '../hooks/use-cards-dashboard';
import { getDefaultGroupId } from '../word-library/default-groups';
import { SelectionActionBar } from './selection-action-bar';
import { createLocalizedMessages } from '@/lib/i18n/locale';
import './word-library.css';

const messages = createLocalizedMessages({
  back: 'Volver a mis tarjetas',
  title: 'Biblioteca de palabras',
  summary:
    'Explora vocabulario en inglés y guarda cada palabra en su colección.',
  searchLabel: 'Buscar en la biblioteca',
  searchPlaceholder: 'Buscar palabra, significado o ejemplo…',
  categoriesLabel: 'Categorías de vocabulario',
  allCategories: ALL_WORD_LIBRARY_CATEGORIES,
  levelsLabel: 'Nivel de inglés',
  allLevels: 'Todos',
  levelNames: WORD_LIBRARY_LEVEL_LABELS,
  clearFilters: 'Quitar filtros',
  emptyFiltered: 'No encontramos palabras con esos filtros.',
  resultCount: (count: number) =>
    `${count} ${count === 1 ? 'palabra disponible' : 'palabras disponibles'}`,
  addMode: 'Agregar',
  addBarLabel: 'Agregar palabras',
  selectedWords: (count: number) =>
    `${count} ${count === 1 ? 'palabra seleccionada' : 'palabras seleccionadas'}`,
  selectAll: 'Seleccionar todas',
  clearSelection: 'Quitar selección',
  cancelAdd: 'Cancelar',
  addAction: (count: number) => `Agregar ${count}`,
  selectWord: (term: string) => `Seleccionar ${term}`,
  addResult: (added: number, duplicates: number) => {
    const parts = [];
    if (added > 0)
      parts.push(
        `${added} ${added === 1 ? 'palabra agregada' : 'palabras agregadas'} a sus colecciones`
      );
    if (duplicates > 0)
      parts.push(
        duplicates === 1
          ? '1 palabra ya existe en tus tarjetas y no se añadió de nuevo'
          : `${duplicates} palabras ya existen en tus tarjetas y no se añadieron de nuevo`
      );
    return parts.join('. ');
  },
  empty: 'No encontramos palabras con esa búsqueda.',
  loading: 'Cargando tus grupos…',
  pronunciation: 'Pronunciación',
  example: 'Ejemplo',
  alreadyInLibrary: 'Ya está en tus tarjetas',
  previousPage: 'Anterior',
  nextPage: 'Siguiente',
  paginationLabel: 'Paginación de palabras',
  pageStatus: (page: number, pageCount: number) =>
    `Página ${page} de ${pageCount}`
});

// Kept for callers that import the routing helper from this module.
export { getDefaultGroupId };

const LEVEL_OPTIONS: readonly WordLibraryLevelFilter[] = [
  ALL_WORD_LIBRARY_LEVELS,
  ...WORD_LIBRARY_LEVELS
];

type CategoryFilter = WordLibraryCategory | typeof ALL_WORD_LIBRARY_CATEGORIES;

const CATEGORY_OPTIONS: readonly CategoryFilter[] = [
  ALL_WORD_LIBRARY_CATEGORIES,
  ...WORD_LIBRARY_CATEGORIES
];

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

type WordLibraryEntryCardProps = {
  entry: WordLibraryEntry;
  isAdding: boolean;
  isSelected: boolean;
  isAlreadyAdded: boolean;
  showLevel: boolean;
  onToggleSelect: (entryId: string) => void;
};

export function WordLibraryEntryCard({
  entry,
  isAdding,
  isSelected,
  isAlreadyAdded,
  showLevel,
  onToggleSelect
}: WordLibraryEntryCardProps) {
  const isSelectable = isAdding && !isAlreadyAdded;

  return (
    <article
      className="word-library__entry"
      data-adding={isAdding}
      data-selected={isSelected}
      data-existing={isAlreadyAdded}
    >
      {isSelectable && (
        <>
          <button
            aria-checked={isSelected}
            aria-label={messages.selectWord(entry.term)}
            className="word-library__select"
            onClick={() => onToggleSelect(entry.id)}
            role="checkbox"
            type="button"
          />
          <span className="word-library__check" aria-hidden="true">
            <Check size={14} strokeWidth={3} />
          </span>
        </>
      )}
      <div className="word-library__entry-heading">
        <h2 className="word-library__entry-term">{entry.term}</h2>
        <span className="word-library__category">{entry.category}</span>
        {showLevel && (
          <span className="word-library__level-tag">
            {messages.levelNames[entry.level]}
          </span>
        )}
      </div>
      <p className="word-library__meaning">{entry.meaning}</p>
      <p className="word-library__phonetics">
        <span>{messages.pronunciation}</span> {entry.phonetics}
      </p>
      <p className="word-library__example">
        <span>{messages.example}</span> “{entry.example}”
      </p>
      {isAlreadyAdded && (
        <p className="word-library__existing">
          <LockKeyhole aria-hidden="true" size={14} />
          {messages.alreadyInLibrary}
        </p>
      )}
    </article>
  );
}

export function WordLibrary() {
  const dashboard = useCardsDashboard();
  const [category, setCategory] = useState<CategoryFilter>(
    ALL_WORD_LIBRARY_CATEGORIES
  );
  const [level, setLevel] = useState<WordLibraryLevelFilter>(
    ALL_WORD_LIBRARY_LEVELS
  );
  const [searchText, setSearchText] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [announcement, setAnnouncement] = useState('');
  const [page, setPage] = useState(1);
  const existingTerms = useMemo(
    () => new Set(dashboard.cards.map(card => normalizeCatalogTerm(card.term))),
    [dashboard.cards]
  );

  const filteredEntries = useMemo(
    () =>
      sortWordLibraryEntries(
        filterCatalogEntries(wordLibraryCatalog, category, searchText, level),
        existingTerms
      ),
    [category, existingTerms, level, searchText]
  );
  const levelCounts = useMemo(
    () => countEntriesByLevel(wordLibraryCatalog),
    []
  );
  const categoryCounts = useMemo(
    () => countEntriesByCategory(wordLibraryCatalog, level),
    [level]
  );
  const hasActiveFilters =
    level !== ALL_WORD_LIBRARY_LEVELS ||
    category !== ALL_WORD_LIBRARY_CATEGORIES ||
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
    setCategory(ALL_WORD_LIBRARY_CATEGORIES);
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
    const result = dashboard.addWordLibraryEntries(selectedEntries);
    setAnnouncement(
      messages.addResult(result.added.length, result.duplicates.length)
    );
    stopAdding();
  }

  if (!dashboard.isLibraryReady) {
    return (
      <section className="word-library" aria-live="polite">
        <p className="word-library__loading">{messages.loading}</p>
      </section>
    );
  }

  return (
    <div className="word-library" data-adding={isAdding}>
      <Link className="word-library__back" href="/cards">
        <ArrowLeft size={18} aria-hidden="true" />
        {messages.back}
      </Link>

      <header className="word-library__header">
        <div className="word-library__title-row">
          <span className="word-library__mark" aria-hidden="true">
            <BookOpen size={24} />
          </span>
          <h1 id="word-library-title">{messages.title}</h1>
        </div>
        <p>{messages.summary}</p>
      </header>

      <section className="word-library__browser" aria-label={messages.title}>
        <div className="word-library__tools">
          <div className="word-library__search-row">
            <label className="word-library__search">
              <Search size={19} aria-hidden="true" />
              <span className="sr-only">{messages.searchLabel}</span>
              <input
                type="search"
                value={searchText}
                onChange={event => {
                  setPage(1);
                  setSearchText(event.target.value);
                }}
                placeholder={messages.searchPlaceholder}
              />
            </label>
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
              className="word-library__levels"
              role="group"
              aria-label={messages.levelsLabel}
            >
              {LEVEL_OPTIONS.map(item => (
                <button
                  key={item}
                  type="button"
                  className={cn(
                    'word-library__level',
                    item === ALL_WORD_LIBRARY_LEVELS &&
                      'word-library__level--reset'
                  )}
                  aria-pressed={level === item}
                  onClick={() => changeLevel(item)}
                >
                  <span>
                    {item === ALL_WORD_LIBRARY_LEVELS
                      ? messages.allLevels
                      : messages.levelNames[item]}
                  </span>
                  <span className="word-library__tally">
                    {levelCounts[item]}
                  </span>
                </button>
              ))}
            </div>
            <div
              className="word-library__categories"
              role="group"
              aria-label={messages.categoriesLabel}
            >
              {CATEGORY_OPTIONS.map(item => (
                <button
                  key={item}
                  type="button"
                  className={cn(
                    'word-library__chip',
                    item === ALL_WORD_LIBRARY_CATEGORIES &&
                      'word-library__chip--reset'
                  )}
                  aria-pressed={category === item}
                  onClick={() => changeCategory(item)}
                >
                  {item === ALL_WORD_LIBRARY_CATEGORIES
                    ? messages.allCategories
                    : item}
                  <span className="word-library__tally">
                    {categoryCounts[item]}
                  </span>
                </button>
              ))}
            </div>
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
              showLevel={level === ALL_WORD_LIBRARY_LEVELS}
              onToggleSelect={toggleEntry}
            />
          ))}
          {filteredEntries.length === 0 && (
            <div className="word-library__empty">
              <p>
                {hasActiveFilters ? messages.emptyFiltered : messages.empty}
              </p>
              {hasActiveFilters && (
                <button type="button" onClick={clearFilters}>
                  {messages.clearFilters}
                </button>
              )}
            </div>
          )}
        </div>
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
