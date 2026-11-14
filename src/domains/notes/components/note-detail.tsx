import { MoreHorizontal, Trash2 } from 'lucide-react';
import { useEffect, useId, useRef, useState } from 'react';
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
  onDelete: () => void;
};

export function NoteDetail({
  note,
  onEdit,
  onToggleFavorite,
  onDelete
}: NoteDetailProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  const descriptionId = useId();
  const isFavorite = note.favorite === true;

  useEffect(() => {
    if (!isConfirmingDelete) return;
    cancelRef.current?.focus();
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsConfirmingDelete(false);
    };
    document.addEventListener('keydown', closeOnEscape);
    return () => document.removeEventListener('keydown', closeOnEscape);
  }, [isConfirmingDelete]);

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
        <div className="note-detail__actions">
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
          <div className="note-detail__menu-wrap">
            <button
              aria-label={messages.moreActions}
              aria-expanded={isMenuOpen}
              className="note-detail__menu-trigger"
              onClick={() => setIsMenuOpen(open => !open)}
              type="button"
            >
              <MoreHorizontal aria-hidden="true" size={20} />
            </button>
            {isMenuOpen && (
              <div className="note-detail__menu">
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    setIsConfirmingDelete(true);
                  }}
                  type="button"
                >
                  <Trash2 aria-hidden="true" size={16} />
                  {messages.delete}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      {isConfirmingDelete && (
        <div
          className="note-detail__confirmation"
          role="alertdialog"
          aria-labelledby={titleId}
          aria-describedby={descriptionId}
        >
          <div>
            <strong id={titleId}>
              {messages.deleteTitle(note.title || notesMessages.list.untitled)}
            </strong>
            <p id={descriptionId}>{messages.deleteBody}</p>
          </div>
          <div className="note-detail__confirmation-actions">
            <button
              ref={cancelRef}
              onClick={() => setIsConfirmingDelete(false)}
              type="button"
            >
              {messages.cancel}
            </button>
            <button
              className="note-detail__delete-confirm"
              onClick={onDelete}
              type="button"
            >
              {messages.confirmDelete}
            </button>
          </div>
        </div>
      )}
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
