'use client';

import { ArrowLeft, Plus } from 'lucide-react';
import { ActionPill } from '@/components/ui/action-pill';
import { Chip } from '@/components/ui/chip';
import { SearchField } from '@/components/ui/search-field';
import { translateText } from '@/lib/i18n/locale';
import { NOTE_FILTERS } from '../data';
import { useNotesWorkspace } from '../hooks/use-notes-workspace';
import { notesMessages } from '../messages';
import { getNoteDisplay } from '../seed-note-display';
import { NoteCategoryManager } from './note-category-manager';
import { NoteDetail } from './note-detail';
import { NoteEditor } from './note-editor';
import { NoteList } from './note-list';
import './notes.css';

const messages = notesMessages.page;

export function NotesWorkspace() {
  const {
    activeFilter,
    categories,
    editingNote,
    searchText,
    selectedNote,
    visibleNotes,
    handleChange,
    handleCreateNote,
    handleCreateCategory,
    handleDeleteCategory,
    handleDeleteNote,
    handleSave,
    handleSelectNote,
    handleToggleFavorite,
    handleRenameCategory,
    setActiveFilter,
    setEditingNoteId,
    setSearchText
  } = useNotesWorkspace();

  if (editingNote) {
    return (
      <div className="notes-editor-view">
        <ActionPill
          className="notes-editor-view__back"
          icon={<ArrowLeft size={18} />}
          onClick={() => setEditingNoteId(null)}
          size="sm"
          variant="tertiary"
        >
          {messages.backToList}
        </ActionPill>
        <NoteEditor
          categories={categories}
          key={editingNote.id}
          note={getNoteDisplay(editingNote)}
          onChange={handleChange}
          onSave={() => {
            handleSave();
            setEditingNoteId(null);
          }}
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
          <p className="notes-page__subtitle">{messages.desktopSubtitle}</p>
          <ActionPill
            className="notes-page__new-note"
            icon={<Plus size={18} strokeWidth={2.6} />}
            onClick={handleCreateNote}
            size="sm"
            variant="primary"
          >
            {messages.newNote}
          </ActionPill>
        </div>
      </header>

      <div className="notes-page__content">
        <div className="notes-page__browse">
          <SearchField
            id="notes-search"
            label={messages.searchLabel}
            onChange={setSearchText}
            placeholder={messages.searchPlaceholder}
            value={searchText}
          />

          <div
            aria-label={messages.filtersLabel}
            className="notes-filters"
            role="group"
          >
            {[...NOTE_FILTERS, ...categories].map(filter => (
              <Chip
                key={filter}
                onClick={() => setActiveFilter(filter)}
                pressed={activeFilter === filter}
              >
                {translateText(filter)}
              </Chip>
            ))}
          </div>

          <NoteCategoryManager
            categories={categories}
            onCreate={handleCreateCategory}
            onDelete={handleDeleteCategory}
            onRename={handleRenameCategory}
          />

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
            onDelete={() => handleDeleteNote(selectedNote.id)}
          />
        ) : (
          <p className="notes-page__detail-empty">{notesMessages.list.empty}</p>
        )}
      </div>
    </section>
  );
}
