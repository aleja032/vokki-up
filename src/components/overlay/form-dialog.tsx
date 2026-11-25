'use client';

import { useEffect, useId, useRef, type ReactNode } from 'react';
import './form-dialog.css';

type FormDialogProps = {
  open: boolean;
  title: string;
  /** Closes the dialog: Escape, a click on the backdrop and the form's cancel. */
  onClose: () => void;
  children: ReactNode;
};

// Native modal dialog for a small form: the browser provides the focus trap,
// the inert background and Escape. The parent owns `open`. The content is only
// mounted while open, so the form starts from its defaults every time. On open
// the element marked `data-autofocus` takes the focus (the first focusable
// element otherwise).
export function FormDialog({
  open,
  title,
  onClose,
  children
}: FormDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      dialog.querySelector<HTMLElement>('[data-autofocus]')?.focus();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      className="form-dialog"
      role="dialog"
      aria-labelledby={titleId}
      onCancel={event => {
        event.preventDefault();
        onClose();
      }}
      onClick={event => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="form-dialog__panel">
        <h2 className="form-dialog__title" id={titleId}>
          {title}
        </h2>
        {open ? children : null}
      </div>
    </dialog>
  );
}
