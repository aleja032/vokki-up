'use client';

import { TriangleAlert } from 'lucide-react';
import { useEffect, useId, useRef } from 'react';
import { actionPillClass } from '@/components/ui/action-pill';
import './confirm-dialog.css';

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel: string;
  tone?: 'danger';
  onConfirm: () => void;
  onCancel: () => void;
};

// Native modal dialog: the browser provides the focus trap, the inert
// background and Escape. The parent owns `open`; Escape, backdrop clicks and
// the cancel button all route through `onCancel`.
export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel,
  cancelLabel,
  tone = 'danger',
  onConfirm,
  onCancel
}: ConfirmDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      cancelRef.current?.focus();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      className="confirm-dialog"
      role="alertdialog"
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      data-tone={tone}
      onCancel={event => {
        event.preventDefault();
        onCancel();
      }}
      onClick={event => {
        if (event.target === event.currentTarget) onCancel();
      }}
    >
      <div className="confirm-dialog__panel">
        <span className="confirm-dialog__icon" aria-hidden="true">
          <TriangleAlert size={22} />
        </span>
        <div className="confirm-dialog__copy">
          <h2 className="confirm-dialog__title" id={titleId}>
            {title}
          </h2>
          <p className="confirm-dialog__description" id={descriptionId}>
            {description}
          </p>
        </div>
        <div className="confirm-dialog__actions">
          <button
            className={actionPillClass('secondary')}
            ref={cancelRef}
            onClick={onCancel}
            type="button"
          >
            {cancelLabel}
          </button>
          <button
            className={actionPillClass('danger')}
            onClick={onConfirm}
            type="button"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </dialog>
  );
}
