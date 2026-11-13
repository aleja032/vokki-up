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
import { useCardsDashboard } from '../hooks/use-cards-dashboard';
import { createLocalizedMessages } from '@/lib/i18n/locale';
import './word-library.css';

const messages = createLocalizedMessages({
  back: 'Volver a mis tarjetas',
  title: 'Biblioteca de palabras',
  summary:
    'Explora vocabulario en inglés y elige qué palabras guardar en tus grupos.',
  searchLabel: 'Buscar en la biblioteca',
  searchPlaceholder: 'Buscar palabra, significado o ejemplo…',
  categoriesLabel: 'Categorías de vocabulario',
  allCategories: ALL_WORD_LIBRARY_CATEGORIES,
  resultCount: (count: number) =>
    `${count} ${count === 1 ? 'palabra disponible' : 'palabras disponibles'}`,
  selectCollection: 'Añadir a grupo',
  collectionPlaceholder: 'Elige un grupo',
  selectWords: (count: number) =>
    `${count} ${count === 1 ? 'seleccionada' : 'seleccionadas'}`,
  addSelected: 'Añadir selección',
  addResult: (added: number, duplicates: number, groupName: string) => {
    const parts = [];
    if (added > 0)
      parts.push(
        `${added} ${added === 1 ? 'palabra añadida' : 'palabras añadidas'} a “${groupName}”`
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
  chooseGroupFirst: 'Selecciona un grupo y al menos una palabra.'
});

export function WordLibrary() {
  const dashboard = useCardsDashboard();
  const [category, setCategory] = useState(ALL_WORD_LIBRARY_CATEGORIES);
  const [searchText, setSearchText] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [groupId, setGroupId] = useState('');
  const [announcement, setAnnouncement] = useState('');

  const filteredEntries = useMemo(
    () => filterCatalogEntries(wordLibraryCatalog, category, searchText),
    [category, searchText]
  );
  const selectedEntries = wordLibraryCatalog.filter(entry =>
    selectedIds.includes(entry.id)
  );
  const existingTerms = new Set(
    dashboard.cards.map(card => normalizeCatalogTerm(card.term))
  );
  const activeGroup = dashboard.groups.find(group => group.id === groupId);

  function toggleEntry(entryId: string) {
    setSelectedIds(current =>
      current.includes(entryId)
        ? current.filter(id => id !== entryId)
        : [...current, entryId]
    );
    setAnnouncement('');
  }

  function addSelectedEntries() {
    if (!activeGroup || selectedEntries.length === 0) {
      setAnnouncement(messages.chooseGroupFirst);
      return;
    }

    const result = dashboard.addWordLibraryEntries(selectedEntries, groupId);
    setAnnouncement(
      messages.addResult(
        result.added.length,
        result.duplicates.length,
        activeGroup.name
      )
    );
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
          <label className="word-library__search">
            <Search size={19} aria-hidden="true" />
            <span className="sr-only">{messages.searchLabel}</span>
            <input
              type="search"
              value={searchText}
              onChange={event => setSearchText(event.target.value)}
              placeholder={messages.searchPlaceholder}
            />
          </label>
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
                onClick={() => setCategory(item)}
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
          {filteredEntries.map(entry => {
            const isSelected = selectedIds.includes(entry.id);
            const isAlreadyAdded = existingTerms.has(
              normalizeCatalogTerm(entry.term)
            );

            return (
              <article
                className="word-library__entry"
                key={entry.id}
                data-selected={isSelected}
              >
                <label className="word-library__selection">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleEntry(entry.id)}
                    aria-label={`${entry.term}: ${entry.meaning}`}
                  />
                  <span className="word-library__check" aria-hidden="true">
                    <Check size={15} />
                  </span>
                </label>
                <div className="word-library__entry-content">
                  <div className="word-library__entry-heading">
                    <h2>{entry.term}</h2>
                    <span className="word-library__category">
                      {entry.category}
                    </span>
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
                      {messages.alreadyInLibrary}
                    </p>
                  )}
                </div>
              </article>
            );
          })}
          {filteredEntries.length === 0 && (
            <p className="word-library__empty">{messages.empty}</p>
          )}
        </div>
      </section>

      <aside
        className="word-library__add-bar"
        aria-label={messages.addSelected}
      >
        <label className="word-library__group-select">
          <span>{messages.selectCollection}</span>
          <select
            value={groupId}
            onChange={event => setGroupId(event.target.value)}
          >
            <option value="">{messages.collectionPlaceholder}</option>
            {dashboard.groups.map(group => (
              <option key={group.id} value={group.id}>
                {group.name}
              </option>
            ))}
          </select>
        </label>
        <div className="word-library__add-actions">
          <span>{messages.selectWords(selectedIds.length)}</span>
          <button
            type="button"
            onClick={addSelectedEntries}
            disabled={!groupId || selectedIds.length === 0}
          >
            {messages.addSelected}
          </button>
        </div>
        <p
          className="word-library__announcement"
          role="status"
          aria-live="polite"
        >
          {announcement}
        </p>
      </aside>
    </div>
  );
}
