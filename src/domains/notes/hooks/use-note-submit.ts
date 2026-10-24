'use client';

import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { noteSchema, type NoteInput } from '../note.schema';
import type { Note } from '../types';

type UseNoteSubmitOptions = {
  note: Note;
  onChange: (note: Note) => void;
  onSave: () => void;
};

export function useNoteSubmit({
  note,
  onChange,
  onSave
}: UseNoteSubmitOptions) {
  const [isSaved, setIsSaved] = useState(true);
  const { register, handleSubmit, subscribe } = useForm<NoteInput>({
    resolver: zodResolver(noteSchema),
    defaultValues: {
      title: note.title,
      category: note.category,
      body: note.body
    }
  });

  // Keep the latest props reachable from the subscription below without
  // re-subscribing on every render.
  const latest = useRef({ note, onChange });
  useEffect(() => {
    latest.current = { note, onChange };
  });

  // Every change is propagated to the parent right away (autosave).
  useEffect(() => {
    return subscribe({
      formState: { values: true },
      callback: ({ values }) => {
        const { note: currentNote, onChange: notifyChange } = latest.current;
        notifyChange({
          ...currentNote,
          title: values.title,
          category: values.category,
          body: values.body
        });
        setIsSaved(false);
      }
    });
  }, [subscribe]);

  const onSubmit = handleSubmit(() => {
    onSave();
    setIsSaved(true);
  });

  return { register, onSubmit, isSaved };
}
