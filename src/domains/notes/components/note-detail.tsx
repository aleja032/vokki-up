import { groupNoteSections } from '../note-content.util';
import { notesMessages } from '../messages';
import type { Note } from '../types';
import { BulletListIcon, CardsIcon, StarIcon } from './note-icons';
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
      <div
        aria-label={messages.toolbarLabel}
        className="note-detail__toolbar"
        role="toolbar"
      >
        <button
          aria-label={messages.bold}
          className="note-detail__tool"
          type="button"
        >
          B
        </button>
        <button
          aria-label={messages.italic}
          className="note-detail__tool note-detail__tool--italic"
          type="button"
        >
          I
        </button>
        <button
          aria-label={messages.underline}
          className="note-detail__tool note-detail__tool--underline"
          type="button"
        >
          U
        </button>
        <button
          aria-label={messages.bulletList}
          className="note-detail__tool"
          type="button"
        >
          <BulletListIcon size={18} />
        </button>
        <button className="note-detail__create-card" type="button">
          <CardsIcon size={16} />
          {messages.createCard}
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
                    <li key={itemIndex}>{item}</li>
                  ))}
                </ul>
              ) : (
                <p className="note-detail__paragraph" key={blockIndex}>
                  {block.text}
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
