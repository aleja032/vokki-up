'use client';

import { ArrowLeft } from 'lucide-react';
import { NOTE_FILTERS } from '../data';
import { useNotesWorkspace } from '../hooks/use-notes-workspace';
import { notesMessages } from '../messages';
import { NoteDetail } from './note-detail';
import { NoteEditor } from './note-editor';
import { PlusIcon, SearchIcon } from './note-icons';
import { NoteList } from './note-list';
import './notes.css';

const messages = notesMessages.page;

export function NotesWorkspace() {
  const {
    activeFilter,
    editingNote,
    searchText,
    selectedNote,
    visibleNotes,
    handleChange,
    handleCreateNote,
    handleSave,
    handleSelectNote,
    handleToggleFavorite,
    setActiveFilter,
    setEditingNoteId,
    setSearchText
  } = useNotesWorkspace();

  if (editingNote) {
    return (
      <div className="notes-editor-view">
        <button
          className="notes-editor-view__back"
          onClick={() => setEditingNoteId(null)}
          type="button"
        >
          <ArrowLeft aria-hidden="true" size={18} />
          <span>{messages.backToList}</span>
        </button>
        <NoteEditor
          key={editingNote.id}
          note={editingNote}
          onChange={handleChange}
          onSave={handleSave}
        />
      </div>
    );
  }

  return (
    <section className="notes-page" aria-labelledby="notes-title">
      <header className="notes-page__header">
        <div className="notes-page__heading">
          <h1 className="notes-page__title" id="notes-title">
            {messages.title}
          </h1>
          <p className="notes-page__subtitle notes-page__subtitle--desktop">
            {messages.desktopSubtitle}
          </p>
        </div>
        <span className="notes-page__subtitle notes-page__subtitle--mobile">
          {messages.mobileSubtitle}
        </span>
        <button
          className="notes-page__new-note notes-page__new-note--desktop"
          onClick={handleCreateNote}
          type="button"
        >
          <PlusIcon size={18} />
          {messages.newNote}
        </button>
      </header>

      <div className="notes-page__content">
        <div className="notes-page__browse">
          <label className="notes-lookup">
            <span className="notes-lookup__icon">
              <SearchIcon />
            </span>
            <span className="sr-only">{messages.searchLabel}</span>
            <input
              aria-label={messages.searchLabel}
              className="notes-lookup__input"
              onChange={event => setSearchText(event.target.value)}
              placeholder={messages.searchPlaceholder}
              type="search"
              value={searchText}
            />
          </label>

          <div className="notes-filters" aria-label={messages.filtersLabel}>
            {NOTE_FILTERS.map(filter => (
              <button
                aria-pressed={activeFilter === filter}
                className="notes-filter"
                key={filter}
                onClick={() => setActiveFilter(filter)}
                type="button"
              >
                {filter}
              </button>
            ))}
          </div>

          <NoteList
            notes={visibleNotes}
            onSelect={handleSelectNote}
            onToggleFavorite={handleToggleFavorite}
            selectedNoteId={selectedNote?.id}
          />
        </div>

        {selectedNote ? (
          <NoteDetail
            note={selectedNote}
            onEdit={() => setEditingNoteId(selectedNote.id)}
            onToggleFavorite={() => handleToggleFavorite(selectedNote.id)}
          />
        ) : (
          <p className="notes-page__detail-empty">{notesMessages.list.empty}</p>
        )}
      </div>

      <button
        className="notes-page__new-note notes-page__new-note--mobile"
        onClick={handleCreateNote}
        type="button"
      >
        <PlusIcon />
        {messages.newNote}
      </button>
    </section>
  );
}
