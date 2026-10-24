'use client';

import { useMemo, useState } from 'react';
import { collectionChangeBuilder } from '@/lib/sync/change-builders';
import { useTrackedBrowserState } from '@/lib/sync/use-tracked-browser-state';
import { INITIAL_NOTES, NOTE_CATEGORIES } from '../data';
import type { Note, NoteFilter } from '../types';

const noteChanges = collectionChangeBuilder<Note>('note');
const MOBILE_QUERY = '(max-width: 760px)';

export function useNotesWorkspace() {
  const [notes, setNotes] = useTrackedBrowserState(
    'notes/library',
    INITIAL_NOTES,
    isNoteList,
    noteChanges
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
    return notes.filter(note => {
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
    });
  }, [activeFilter, notes, searchText]);

  function handleCreateNote() {
    const note: Note = {
      id: `note-${Date.now()}`,
      title: '',
      category: 'Ideas',
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

  function handleSelectNote(noteId: string) {
    setSelectedNoteId(noteId);
    if (window.matchMedia(MOBILE_QUERY).matches) {
      setEditingNoteId(noteId);
    }
  }

  return {
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
  };
}

function isNoteList(value: unknown): value is Note[] {
  const categories = [...NOTE_CATEGORIES];
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
        categories.includes(note.category as Note['category']) &&
        'body' in note &&
        typeof note.body === 'string' &&
        'updatedAt' in note &&
        typeof note.updatedAt === 'string' &&
        (!('favorite' in note) || typeof note.favorite === 'boolean')
    )
  );
}
