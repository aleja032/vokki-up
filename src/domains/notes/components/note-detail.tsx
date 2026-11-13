import { groupNoteSections } from '../note-content.util';
import { notesMessages } from '../messages';
import type { Note } from '../types';
import { StarIcon } from './note-icons';
import { NoteInlineText } from './note-inline-text';
import './notes.css';

const messages = notesMessages.detail;

type NoteDetailProps = {
  note: Note;
  onEdit: () => void;
  onToggleFavorite: () => void;
};

export function NoteDetail({
  note,
  onEdit,
  onToggleFavorite
}: NoteDetailProps) {
  const isFavorite = note.favorite === true;
  return (
    <article className="note-detail" aria-label={messages.label}>
      <div className="note-detail__header">
        <div className="note-detail__heading">
          <h2 className="note-detail__title">
            {note.title || notesMessages.list.untitled}
          </h2>
          <span className="note-detail__meta">
            {messages.meta(note.category, note.updatedAt)}
          </span>
        </div>
        <button
          aria-label={
            isFavorite ? messages.unmarkFavorite : messages.markFavorite
          }
          aria-pressed={isFavorite}
          className="note-detail__favorite"
          onClick={onToggleFavorite}
          type="button"
        >
          <StarIcon filled={isFavorite} />
        </button>
      </div>
      <div className="note-detail__body">
        {groupNoteSections(note.body).map((section, sectionIndex) => (
          <div className="note-detail__section" key={sectionIndex}>
            {section.heading && (
              <h3 className="note-detail__section-title">{section.heading}</h3>
            )}
            {section.blocks.map((block, blockIndex) =>
              block.type === 'list' ? (
                <ul className="note-detail__list" key={blockIndex}>
                  {block.items.map((item, itemIndex) => (
                    <li key={itemIndex}>
                      <NoteInlineText text={item} />
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="note-detail__paragraph" key={blockIndex}>
                  <NoteInlineText text={block.text} />
                </p>
              )
            )}
          </div>
        ))}
      </div>
      <button className="note-detail__edit" onClick={onEdit} type="button">
        {messages.edit}
      </button>
    </article>
  );
}
