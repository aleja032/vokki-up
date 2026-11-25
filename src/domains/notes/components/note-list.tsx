import { translateText } from '@/lib/i18n/locale';
import { getNotePreview } from '../note-content.util';
import { getNoteCategoryTone } from '../note-category-tone.util';
import { notesMessages } from '../messages';
import { getNoteDisplay } from '../seed-note-display';
import type { Note } from '../types';
import { StarIcon } from './note-icons';
import './notes.css';

const messages = notesMessages.list;

type NoteListProps = {
  notes: Note[];
  selectedNoteId?: string | null;
  onSelect: (noteId: string) => void;
  onToggleFavorite: (noteId: string) => void;
};

export function NoteList({
  notes,
  selectedNoteId,
  onSelect,
  onToggleFavorite
}: NoteListProps) {
  return (
    <div className="notes-cards" aria-label={messages.label}>
      {notes.map(storedNote => {
        const note = getNoteDisplay(storedNote);
        const isFavorite = note.favorite === true;
        const title = note.title || messages.untitled;
        return (
          <article
            className="note-card"
            data-favorite={isFavorite}
            data-selected={note.id === selectedNoteId}
            data-tone={getNoteCategoryTone(note.category)}
            key={note.id}
          >
            <button
              aria-pressed={note.id === selectedNoteId}
              className="note-card__open"
              onClick={() => onSelect(note.id)}
              type="button"
            >
              <span aria-hidden="true" className="note-card__bar" />
              <span className="note-card__copy">
                <span className="note-card__title" title={title}>
                  {title}
                </span>
                <span className="note-card__preview">
                  {getNotePreview(note.body) || ' '}
                </span>
                <span className="note-card__meta">
                  <span className="note-card__type">
                    {translateText(note.category)}
                  </span>
                  <span aria-hidden="true">·</span>
                  <time
                    className="note-card__date"
                    title={translateText(note.updatedAt)}
                  >
                    {translateText(note.updatedAt)}
                  </time>
                </span>
              </span>
            </button>
            <button
              aria-label={
                isFavorite
                  ? messages.unmarkFavorite(title)
                  : messages.markFavorite(title)
              }
              aria-pressed={isFavorite}
              className="note-card__favorite"
              onClick={() => onToggleFavorite(note.id)}
              type="button"
            >
              <StarIcon filled={isFavorite} size={20} />
            </button>
          </article>
        );
      })}
      {notes.length === 0 && (
        <p className="notes-cards__empty">{messages.empty}</p>
      )}
    </div>
  );
}
