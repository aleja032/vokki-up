'use client';
import { Check, FileText } from 'lucide-react';
import { useNoteFormatting } from '../hooks/use-note-formatting';
import { useNoteSubmit } from '../hooks/use-note-submit';
import { notesMessages } from '../messages';
import type { Note } from '../types';
import { NoteFormatToolbar } from './note-format-toolbar';
import './notes.css';

const messages = notesMessages.editor;

type NoteEditorProps = {
  categories: string[];
  note: Note;
  onChange: (note: Note) => void;
  onSave: () => void;
};
export function NoteEditor({
  categories,
  note,
  onChange,
  onSave
}: NoteEditorProps) {
  const { register, onSubmit, isSaved, getValues, setValue } = useNoteSubmit({
    note,
    onChange,
    onSave
  });
  const { ref: registerBodyRef, ...bodyField } = register('body');
  const { bodyRef, toggleMark, toggleBullets } = useNoteFormatting({
    getBody: () => getValues('body'),
    setBody: value => setValue('body', value, { shouldDirty: true }),
    registerRef: registerBodyRef
  });
  return (
    <form className="notes-form" onSubmit={onSubmit}>
      <div className="notes-form__top">
        <span className="notes-form__icon">
          <FileText aria-hidden="true" size={18} />
        </span>
        <span
          aria-live="polite"
          className="notes-form__status"
          data-saved={isSaved}
        >
          {isSaved ? messages.statusSaved : messages.statusUnsaved}
        </span>
      </div>
      <label className="sr-only" htmlFor="note-title">
        {messages.titleLabel}
      </label>
      <input
        className="notes-form__title"
        id="note-title"
        placeholder={messages.titlePlaceholder}
        {...register('title')}
      />
      <div className="notes-form__meta">
        <label htmlFor="note-category">{messages.categoryLabel}</label>
        <select
          className="notes-form__category"
          id="note-category"
          {...register('category')}
        >
          {categories.map(category => (
            <option key={category}>{category}</option>
          ))}
        </select>
      </div>
      <label className="sr-only" htmlFor="note-body">
        {messages.bodyLabel}
      </label>
      <NoteFormatToolbar
        onToggleBullets={toggleBullets}
        onToggleMark={toggleMark}
      />
      <textarea
        className="notes-form__body"
        id="note-body"
        placeholder={messages.bodyPlaceholder}
        ref={bodyRef}
        {...bodyField}
      />
      <div className="notes-form__footer">
        <span className="notes-form__hint">{messages.footerHint}</span>
        <button className="notes-form__submit" type="submit">
          <Check aria-hidden="true" size={16} /> {messages.submit}
        </button>
      </div>
    </form>
  );
}
