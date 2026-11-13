import type { MouseEvent } from 'react';
import type { InlineMark } from '../note-inline.util';
import { notesMessages } from '../messages';
import { BulletListIcon } from './note-icons';
import './notes.css';

const messages = notesMessages.editor;

type NoteFormatToolbarProps = {
  onToggleBullets: () => void;
  onToggleMark: (mark: InlineMark) => void;
};

// mousedown is cancelled so the textarea keeps its selection while a tool is
// pressed.
function keepSelection(event: MouseEvent) {
  event.preventDefault();
}

export function NoteFormatToolbar({
  onToggleBullets,
  onToggleMark
}: NoteFormatToolbarProps) {
  return (
    <div
      aria-label={messages.toolbarLabel}
      className="note-format"
      role="toolbar"
    >
      <button
        aria-label={messages.bold}
        className="note-format__tool note-format__tool--bold"
        onClick={() => onToggleMark('bold')}
        onMouseDown={keepSelection}
        type="button"
      >
        B
      </button>
      <button
        aria-label={messages.italic}
        className="note-format__tool note-format__tool--italic"
        onClick={() => onToggleMark('italic')}
        onMouseDown={keepSelection}
        type="button"
      >
        I
      </button>
      <button
        aria-label={messages.underline}
        className="note-format__tool note-format__tool--underline"
        onClick={() => onToggleMark('underline')}
        onMouseDown={keepSelection}
        type="button"
      >
        U
      </button>
      <button
        aria-label={messages.bulletList}
        className="note-format__tool"
        onClick={onToggleBullets}
        onMouseDown={keepSelection}
        type="button"
      >
        <BulletListIcon size={18} />
      </button>
    </div>
  );
}
