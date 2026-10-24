'use client';

import { ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { NOTE_FILTERS } from '../data';
import { useNotesWorkspace } from '../hooks/use-notes-workspace';
import { notesMessages } from '../messages';
import {
  createNoteCategorySchema,
  type NoteCategoryInput
} from '../note.schema';
import { NoteDetail } from './note-detail';
import { NoteEditor } from './note-editor';
import { PlusIcon, SearchIcon } from './note-icons';
import { NoteList } from './note-list';
import './notes.css';

const messages = notesMessages.page;

export function NotesWorkspace() {
  const [isManagingCategories, setIsManagingCategories] = useState(false);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
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
    handleSave,
    handleSelectNote,
    handleToggleFavorite,
    handleRenameCategory,
    setActiveFilter,
    setEditingNoteId,
    setSearchText
  } = useNotesWorkspace();
  const {
    register: registerCategory,
    handleSubmit: handleCategorySubmit,
    reset: resetCategoryForm,
    setValue: setCategoryValue,
    formState: { errors: categoryErrors }
  } = useForm<NoteCategoryInput>({
    resolver: zodResolver(
      createNoteCategorySchema(categories, editingCategory)
    ),
    defaultValues: { name: '' }
  });

  function submitCategory({ name }: NoteCategoryInput) {
    if (editingCategory) {
      handleRenameCategory(editingCategory, name);
    } else {
      handleCreateCategory(name);
    }
    setEditingCategory(null);
    resetCategoryForm({ name: '' });
  }

  function startEditingCategory(category: string) {
    setEditingCategory(category);
    setCategoryValue('name', category);
  }

  function cancelCategoryEdit() {
    setEditingCategory(null);
    resetCategoryForm({ name: '' });
  }

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
          categories={categories}
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
            {[...NOTE_FILTERS, ...categories].map(filter => (
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

          <section
            className="notes-category-manager"
            aria-label={messages.categories.label}
          >
            <button
              aria-expanded={isManagingCategories}
              className="notes-category-manager__toggle"
              onClick={() => setIsManagingCategories(current => !current)}
              type="button"
            >
              {isManagingCategories
                ? messages.categories.hide
                : messages.categories.manage}
            </button>
            {isManagingCategories && (
              <div className="notes-category-manager__panel">
                <form
                  className="notes-category-manager__form"
                  onSubmit={handleCategorySubmit(submitCategory)}
                >
                  <label htmlFor="note-category-name">
                    {editingCategory
                      ? messages.categories.renameLabel
                      : messages.categories.createLabel}
                  </label>
                  <div className="notes-category-manager__field">
                    <input
                      id="note-category-name"
                      maxLength={40}
                      {...registerCategory('name')}
                    />
                    <button
                      className="notes-category-manager__action"
                      type="submit"
                    >
                      {editingCategory
                        ? messages.categories.save
                        : messages.categories.create}
                    </button>
                    {editingCategory && (
                      <button
                        className="notes-category-manager__cancel"
                        onClick={cancelCategoryEdit}
                        type="button"
                      >
                        {messages.categories.cancel}
                      </button>
                    )}
                  </div>
                  {categoryErrors.name?.message && (
                    <p className="notes-category-manager__error" role="alert">
                      {categoryErrors.name.message}
                    </p>
                  )}
                </form>
                <p className="notes-category-manager__hint">
                  {messages.categories.deletionNote}
                </p>
                <ul className="notes-category-manager__list">
                  {categories.map(category => (
                    <li key={category}>
                      <span>{category}</span>
                      {category === 'General' ? (
                        <span className="notes-category-manager__default">
                          {messages.categories.defaultLabel}
                        </span>
                      ) : (
                        <span className="notes-category-manager__actions">
                          <button
                            className="notes-category-manager__link"
                            onClick={() => startEditingCategory(category)}
                            type="button"
                          >
                            {messages.categories.rename}
                          </button>
                          <button
                            className="notes-category-manager__link"
                            onClick={() => {
                              handleDeleteCategory(category);
                              if (editingCategory === category)
                                cancelCategoryEdit();
                            }}
                            type="button"
                          >
                            {messages.categories.delete}
                          </button>
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>

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
