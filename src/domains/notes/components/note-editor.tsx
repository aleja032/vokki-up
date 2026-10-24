'use client';
import { Check, FileText } from 'lucide-react';
import { useNoteSubmit } from '../hooks/use-note-submit';
import { notesMessages } from '../messages';
import type { Note } from '../types';
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
  const { register, onSubmit, isSaved } = useNoteSubmit({
    note,
    onChange,
    onSave
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
      <textarea
        className="notes-form__body"
        id="note-body"
        placeholder={messages.bodyPlaceholder}
        {...register('body')}
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
