'use client';

import { useRef, type RefCallback } from 'react';
import {
  toggleBulletList,
  toggleInlineMark,
  type InlineMark,
  type TextEdit
} from '../note-inline.util';

type UseNoteFormattingOptions = {
  getBody: () => string;
  setBody: (value: string) => void;
  registerRef: RefCallback<HTMLTextAreaElement>;
};

// Applies formatting to the body textarea selection. The textarea stays the
// source of truth for the caret; the form value is updated through setBody so
// autosave keeps working.
export function useNoteFormatting({
  getBody,
  setBody,
  registerRef
}: UseNoteFormattingOptions) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const bodyRef: RefCallback<HTMLTextAreaElement> = element => {
    textareaRef.current = element;
    registerRef(element);
  };

  function apply(edit: (start: number, end: number) => TextEdit) {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const result = edit(textarea.selectionStart, textarea.selectionEnd);
    setBody(result.value);
    textarea.focus();
    textarea.setSelectionRange(result.selectionStart, result.selectionEnd);
  }

  return {
    bodyRef,
    toggleMark: (mark: InlineMark) =>
      apply((start, end) => toggleInlineMark(getBody(), start, end, mark)),
    toggleBullets: () =>
      apply((start, end) => toggleBulletList(getBody(), start, end))
  };
}
