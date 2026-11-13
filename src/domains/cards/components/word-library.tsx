'use client';

import Link from 'next/link';
import { ArrowLeft, BookOpen, Check, Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import {
  ALL_WORD_LIBRARY_CATEGORIES,
  filterCatalogEntries,
  normalizeCatalogTerm,
  WORD_LIBRARY_CATEGORIES,
  wordLibraryCatalog
} from '../word-library/catalog';
import type { WordLibraryCategory } from '../word-library/catalog';
import type { CardGroup } from '../types';
import { useCardsDashboard } from '../hooks/use-cards-dashboard';
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
  resultCount: (count: number) =>
    `${count} ${count === 1 ? 'palabra disponible' : 'palabras disponibles'}`,
  selectWords: (count: number) =>
    `${count} ${count === 1 ? 'seleccionada' : 'seleccionadas'}`,
  addSelected: 'Agregar seleccionadas',
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
  noGroupsTitle: 'Crea un grupo para guardar palabras',
  noGroupsBody:
    'Tus palabras se guardan en grupos propios. Crea uno y vuelve para añadirlas.',
  createGroup: 'Volver para crear un grupo',
  loading: 'Cargando tus grupos…',
  pronunciation: 'Pronunciación',
  example: 'Ejemplo',
  alreadyInLibrary: 'Ya está en tus tarjetas',
  chooseWordsFirst: 'Selecciona al menos una palabra.',
  previousPage: 'Anterior',
  nextPage: 'Siguiente',
  paginationLabel: 'Paginación de palabras',
  pageStatus: (page: number, pageCount: number) =>
    `Página ${page} de ${pageCount}`
});

const DEFAULT_GROUP_IDS: Record<WordLibraryCategory, string> = {
  Trabajo: 'work',
  Viajes: 'travel',
  'Día a día': 'daily',
  'Frases útiles': 'phrases'
};

export function getDefaultGroupId(
  category: WordLibraryCategory,
  groups: readonly CardGroup[]
) {
  const id = DEFAULT_GROUP_IDS[category];
  const matchingName = groups.find(group => group.name === category);
  if (matchingName) return matchingName.id;
  return groups.some(group => group.id === id) ? id : undefined;
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

export function WordLibrary() {
  const dashboard = useCardsDashboard();
  const [category, setCategory] = useState(ALL_WORD_LIBRARY_CATEGORIES);
  const [searchText, setSearchText] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [announcement, setAnnouncement] = useState('');
  const [page, setPage] = useState(1);

  const filteredEntries = useMemo(
    () => filterCatalogEntries(wordLibraryCatalog, category, searchText),
    [category, searchText]
  );
  const pageCount = Math.max(
    1,
    Math.ceil(filteredEntries.length / WORD_LIBRARY_PAGE_SIZE)
  );
  const currentPage = Math.min(page, pageCount);
  const pageEntries = paginateWordLibraryEntries(filteredEntries, currentPage);
  const selectedEntries = wordLibraryCatalog.filter(entry =>
    selectedIds.includes(entry.id)
  );
  const existingTerms = new Set(
    dashboard.cards.map(card => normalizeCatalogTerm(card.term))
  );
  const hasSelectedGroup = selectedEntries.every(entry =>
    getDefaultGroupId(entry.category, dashboard.groups)
  );

  function toggleEntry(entryId: string) {
    setSelectedIds(current =>
      current.includes(entryId)
        ? current.filter(id => id !== entryId)
        : [...current, entryId]
    );
    setAnnouncement('');
  }

  function addSelectedEntries() {
    if (selectedEntries.length === 0) {
      setAnnouncement(messages.chooseWordsFirst);
      return;
    }

    const entriesByGroup = new Map<string, typeof selectedEntries>();
    for (const entry of selectedEntries) {
      const groupId = getDefaultGroupId(entry.category, dashboard.groups);
      if (!groupId) continue;
      entriesByGroup.set(groupId, [
        ...(entriesByGroup.get(groupId) ?? []),
        entry
      ]);
    }

    let added = 0;
    let duplicates = 0;
    for (const [groupId, entries] of entriesByGroup) {
      const result = dashboard.addWordLibraryEntries(entries, groupId);
      added += result.added.length;
      duplicates += result.duplicates.length;
    }
    setAnnouncement(messages.addResult(added, duplicates));
    setSelectedIds([]);
  }

  if (!dashboard.isLibraryReady) {
    return (
      <section className="word-library" aria-live="polite">
        <p className="word-library__loading">{messages.loading}</p>
      </section>
    );
  }

  if (dashboard.groups.length === 0) {
    return (
      <section className="word-library" aria-labelledby="word-library-title">
        <Link className="word-library__back" href="/cards">
          <ArrowLeft size={18} aria-hidden="true" />
          {messages.back}
        </Link>
        <header className="word-library__header">
          <h1 id="word-library-title">{messages.noGroupsTitle}</h1>
          <p>{messages.noGroupsBody}</p>
        </header>
        <Link className="word-library__create-group" href="/cards">
          {messages.createGroup}
        </Link>
      </section>
    );
  }

  return (
    <div className="word-library" aria-labelledby="word-library-title">
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
            <aside
              className="word-library__add-bar"
              aria-label={messages.addSelected}
            >
              <button
                type="button"
                onClick={addSelectedEntries}
                disabled={selectedIds.length === 0 || !hasSelectedGroup}
                aria-label={`${messages.addSelected}: ${messages.selectWords(selectedIds.length)}`}
              >
                {messages.addSelected}
                <span
                  className="word-library__selected-count"
                  aria-hidden="true"
                >
                  {selectedIds.length}
                </span>
              </button>
            </aside>
          </div>
          <p
            className="word-library__announcement"
            role="status"
            aria-live="polite"
          >
            {announcement}
          </p>
          <div
            className="word-library__categories"
            role="group"
            aria-label={messages.categoriesLabel}
          >
            {[messages.allCategories, ...WORD_LIBRARY_CATEGORIES].map(item => (
              <button
                key={item}
                type="button"
                aria-pressed={category === item}
                onClick={() => {
                  setPage(1);
                  setCategory(item);
                }}
              >
                {item}
              </button>
            ))}
          </div>
          <p className="word-library__count" aria-live="polite">
            {messages.resultCount(filteredEntries.length)}
          </p>
        </div>

        <div className="word-library__list">
          {pageEntries.map(entry => {
            const isSelected = selectedIds.includes(entry.id);
            const isAlreadyAdded = existingTerms.has(
              normalizeCatalogTerm(entry.term)
            );

            return (
              <label
                className="word-library__entry"
                key={entry.id}
                data-selected={isSelected}
                data-existing={isAlreadyAdded}
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  disabled={isAlreadyAdded}
                  onChange={() => toggleEntry(entry.id)}
                  aria-label={`${entry.term}: ${entry.meaning}`}
                />
                <span className="word-library__check" aria-hidden="true">
                  <Check size={15} />
                </span>
                <span className="word-library__entry-content">
                  <span className="word-library__entry-heading">
                    <span
                      className="word-library__entry-term"
                      role="heading"
                      aria-level={2}
                    >
                      {entry.term}
                    </span>
                    <span className="word-library__category">
                      {entry.category}
                    </span>
                  </span>
                  <span className="word-library__meaning">{entry.meaning}</span>
                  <span className="word-library__phonetics">
                    <span>{messages.pronunciation}</span> {entry.phonetics}
                  </span>
                  <span className="word-library__example">
                    <span>{messages.example}</span> “{entry.example}”
                  </span>
                  {isAlreadyAdded && (
                    <span className="word-library__existing">
                      {messages.alreadyInLibrary}
                    </span>
                  )}
                </span>
              </label>
            );
          })}
          {filteredEntries.length === 0 && (
            <p className="word-library__empty">{messages.empty}</p>
          )}
        </div>
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
      </section>
    </div>
  );
}
