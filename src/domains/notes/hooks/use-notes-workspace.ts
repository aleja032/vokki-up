'use client';

import { useMemo, useState } from 'react';
import {
  collectionChangeBuilder,
  scalarChangeBuilder
} from '@/lib/sync/change-builders';
import { useTrackedBrowserState } from '@/lib/sync/use-tracked-browser-state';
import {
  DEFAULT_NOTE_CATEGORY,
  INITIAL_NOTES,
  NOTE_CATEGORIES,
  reassignNoteCategory,
  renameNoteCategory,
  sortNotesFavoritesFirst
} from '../data';
import type { Note, NoteFilter } from '../types';

const noteChanges = collectionChangeBuilder<Note>('note');
const categoryChanges = scalarChangeBuilder<string[]>(
  'settings',
  'notes/categories'
);
const MOBILE_QUERY = '(max-width: 760px)';

export function useNotesWorkspace() {
  const [notes, setNotes] = useTrackedBrowserState(
    'notes/library',
    INITIAL_NOTES,
    isNoteList,
    noteChanges
  );
  const [categories, setCategories] = useTrackedBrowserState(
    'notes/categories',
    NOTE_CATEGORIES,
    isCategoryList,
    categoryChanges
  );
  const [selectedNoteId, setSelectedNoteId] = useState(
    INITIAL_NOTES[0]?.id ?? null
  );
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<NoteFilter>('Todas');
  const [searchText, setSearchText] = useState('');
  const selectedNote = notes.find(note => note.id === selectedNoteId);
  const editingNote = notes.find(note => note.id === editingNoteId);
  const visibleNotes = useMemo(() => {
    const query = searchText.trim().toLocaleLowerCase();
    return sortNotesFavoritesFirst(
      notes.filter(note => {
        const matchesFilter =
          activeFilter === 'Todas' ||
          (activeFilter === 'Favoritas'
            ? note.favorite === true
            : note.category === activeFilter);
        return (
          matchesFilter &&
          (!query ||
            `${note.title} ${note.body} ${note.category}`
              .toLocaleLowerCase()
              .includes(query))
        );
      })
    );
  }, [activeFilter, notes, searchText]);

  function handleCreateNote() {
    const defaultCategory = categories.includes('Ideas')
      ? 'Ideas'
      : (categories[0] ?? DEFAULT_NOTE_CATEGORY);
    const note: Note = {
      id: `note-${Date.now()}`,
      title: '',
      category: defaultCategory,
      body: '',
      updatedAt: 'Ahora'
    };
    setNotes(current => [note, ...current]);
    setSelectedNoteId(note.id);
    setActiveFilter('Todas');
    setSearchText('');
    setEditingNoteId(note.id);
  }

  function handleChange(changedNote: Note) {
    setNotes(current =>
      current.map(note => (note.id === changedNote.id ? changedNote : note))
    );
  }

  function handleSave() {
    setNotes(current =>
      current.map(note =>
        note.id === editingNoteId ? { ...note, updatedAt: 'Ahora' } : note
      )
    );
  }

  function handleToggleFavorite(noteId: string) {
    setNotes(current =>
      current.map(note =>
        note.id === noteId
          ? { ...note, favorite: note.favorite !== true }
          : note
      )
    );
  }

  function handleCreateCategory(category: string) {
    setCategories(current => [...current, category]);
  }

  function handleRenameCategory(
    previousCategory: string,
    nextCategory: string
  ) {
    setCategories(current =>
      current.map(category =>
        category === previousCategory ? nextCategory : category
      )
    );
    setNotes(current =>
      renameNoteCategory(current, previousCategory, nextCategory)
    );
    if (activeFilter === previousCategory) setActiveFilter(nextCategory);
  }

  function handleDeleteCategory(category: string) {
    if (category === DEFAULT_NOTE_CATEGORY) return;
    setCategories(current => current.filter(item => item !== category));
    setNotes(current => reassignNoteCategory(current, category));
    if (activeFilter === category) setActiveFilter('Todas');
  }

  function handleSelectNote(noteId: string) {
    setSelectedNoteId(noteId);
    if (window.matchMedia(MOBILE_QUERY).matches) {
      setEditingNoteId(noteId);
    }
  }

  return {
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
  };
}

function isNoteList(value: unknown): value is Note[] {
  return (
    Array.isArray(value) &&
    value.every(
      note =>
        typeof note === 'object' &&
        note !== null &&
        'id' in note &&
        typeof note.id === 'string' &&
        'title' in note &&
        typeof note.title === 'string' &&
        'category' in note &&
        typeof note.category === 'string' &&
        'body' in note &&
        typeof note.body === 'string' &&
        'updatedAt' in note &&
        typeof note.updatedAt === 'string' &&
        (!('favorite' in note) || typeof note.favorite === 'boolean')
    )
  );
}

function isCategoryList(value: unknown): value is string[] {
  return (
    Array.isArray(value) &&
    value.includes(DEFAULT_NOTE_CATEGORY) &&
    value.every(category => typeof category === 'string')
  );
}
