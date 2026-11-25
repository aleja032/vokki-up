import { MoreHorizontal, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { ConfirmDialog } from '@/components/overlay/confirm-dialog';
import { ActionPill } from '@/components/ui/action-pill';
import { translateText } from '@/lib/i18n/locale';
import { groupNoteSections } from '../note-content.util';
import {
  getNoteCategoryTone,
  getNoteSectionTone
} from '../note-category-tone.util';
import { notesMessages } from '../messages';
import { getNoteDisplay } from '../seed-note-display';
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
  note: storedNote,
  onEdit,
  onToggleFavorite,
  onDelete
}: NoteDetailProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const note = getNoteDisplay(storedNote);
  const isFavorite = note.favorite === true;

  return (
    <article
      className="note-detail"
      aria-label={messages.label}
      data-tone={getNoteCategoryTone(note.category)}
    >
      <div className="note-detail__header">
        <div className="note-detail__heading">
          <span className="note-detail__tag">
            {translateText(note.category)}
          </span>
          <h2 className="note-detail__title">
            {note.title || notesMessages.list.untitled}
          </h2>
          <span className="note-detail__meta">
            {messages.edited(translateText(note.updatedAt))}
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
      <ConfirmDialog
        open={isConfirmingDelete}
        title={messages.deleteTitle(note.title || notesMessages.list.untitled)}
        description={messages.deleteBody}
        confirmLabel={messages.confirmDelete}
        cancelLabel={messages.cancel}
        onConfirm={() => {
          setIsConfirmingDelete(false);
          onDelete();
        }}
        onCancel={() => setIsConfirmingDelete(false)}
      />
      <div className="note-detail__body">
        {groupNoteSections(note.body).map((section, sectionIndex) => (
          <div
            className="note-detail__section"
            data-tone={getNoteSectionTone(sectionIndex)}
            key={sectionIndex}
          >
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
      <ActionPill className="note-detail__edit" onClick={onEdit} size="sm">
        {messages.edit}
      </ActionPill>
    </article>
  );
}
