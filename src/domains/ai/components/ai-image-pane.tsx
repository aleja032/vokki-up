'use client';

import { useState, type DragEvent } from 'react';
import { aiMessages } from '../messages';
import { AiCaptureIcon } from './ai-capture-icon';
import { AiPaneFrame, type AiPaneFrameProps } from './ai-pane-frame';

const messages = aiMessages.panes;

type AiImagePaneProps = Omit<
  AiPaneFrameProps,
  'title' | 'hint' | 'canSubmit' | 'children'
> & {
  image: File | null;
  onImageChange: (image: File | null) => void;
};

/** Mode 1: an image dropzone/picker. Validation (JPG/PNG, 10 MB) runs in the capture flow. */
export function AiImagePane({
  image,
  onImageChange,
  ...frame
}: AiImagePaneProps) {
  // UI-only: highlights the dropzone while a file is dragged over it.
  const [isDragging, setIsDragging] = useState(false);

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files[0];
    if (file) onImageChange(file);
  }

  return (
    <AiPaneFrame
      title={messages.imageTitle}
      hint={messages.imageHint}
      canSubmit={Boolean(image)}
      {...frame}
    >
      {image ? (
        <div className="aipane__file">
          <span className="aipane__file-icon" aria-hidden="true">
            <AiCaptureIcon name="image" size={22} />
          </span>
          <span className="aipane__file-copy">
            <span className="aipane__file-name" title={image.name}>
              {image.name}
            </span>
            <span className="aipane__file-detail">
              {messages.imageReady(Math.ceil(image.size / 1024))}
            </span>
          </span>
          <button
            className="aipane__file-remove"
            type="button"
            aria-label={messages.removeImage}
            onClick={() => onImageChange(null)}
          >
            <AiCaptureIcon name="close" size={18} />
          </button>
        </div>
      ) : (
        <div
          className="aipane__dropzone"
          data-dragging={isDragging}
          onDragOver={event => {
            event.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
        >
          <span className="aipane__dropzone-icon" aria-hidden="true">
            <AiCaptureIcon name="image" size={28} />
          </span>
          <span className="aipane__dropzone-text">
            {isDragging ? messages.dropzoneActive : messages.dropzoneText}
          </span>
          <label className="aipane__pick" htmlFor="aipane-image-input">
            <AiCaptureIcon name="upload" size={18} />
            {messages.chooseImage}
          </label>
          <input
            id="aipane-image-input"
            className="sr-only"
            type="file"
            accept="image/jpeg,image/png"
            onChange={event => {
              onImageChange(event.target.files?.[0] ?? null);
              event.target.value = '';
            }}
          />
          <span className="aipane__note">{messages.imageLimits}</span>
        </div>
      )}
    </AiPaneFrame>
  );
}
