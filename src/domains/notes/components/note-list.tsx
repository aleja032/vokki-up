import { getNotePreview } from '../note-content.util';
import { notesMessages } from '../messages';
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
      {notes.map(note => {
        const isFavorite = note.favorite === true;
        const title = note.title || messages.untitled;
        return (
          <article
            className="note-card"
            data-favorite={isFavorite}
            data-selected={note.id === selectedNoteId}
            key={note.id}
          >
            <button
              aria-pressed={note.id === selectedNoteId}
              className="note-card__open"
              onClick={() => onSelect(note.id)}
              type="button"
            >
              <span className="note-card__title" title={title}>
                {title}
              </span>
              <span className="note-card__preview">
                {getNotePreview(note.body) || ' '}
              </span>
              <span className="note-card__meta">
                <span className="note-card__type" data-category={note.category}>
                  {note.category}
                </span>
                <time className="note-card__date" title={note.updatedAt}>
                  {note.updatedAt}
                </time>
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
              <StarIcon filled={isFavorite} size={18} />
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
