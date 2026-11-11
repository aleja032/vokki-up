import type { ReactNode } from 'react';
import { aiMessages } from '../messages';
import { AiCaptureIcon } from './ai-capture-icon';
import { AiPaneGroups } from './ai-pane-groups';
import './ai-panes.css';

const messages = aiMessages.panes;

export type AiPaneFrameProps = {
  title: string;
  hint: string;
  groups: Array<{ id: string; name: string; tone?: string }>;
  selectedGroupId: string;
  onGroupChange: (groupId: string) => void;
  error: string;
  isSubmitting: boolean;
  canSubmit: boolean;
  onSubmit: () => void;
  children: ReactNode;
};

/** Heading, body, group chips and the generate action shared by the AI input panes. */
export function AiPaneFrame({
  title,
  hint,
  groups,
  selectedGroupId,
  onGroupChange,
  error,
  isSubmitting,
  canSubmit,
  onSubmit,
  children
}: AiPaneFrameProps) {
  return (
    <form
      className="aipane"
      aria-busy={isSubmitting}
      onSubmit={event => {
        event.preventDefault();
        onSubmit();
      }}
    >
      <header className="aipane__heading">
        <h3>{title}</h3>
        <p>{hint}</p>
      </header>
      <div className="aipane__body">{children}</div>
      <AiPaneGroups
        groups={groups}
        selectedGroupId={selectedGroupId}
        onChange={onGroupChange}
      />
      {error && (
        <p className="aipane__alert" role="alert">
          {error}
        </p>
      )}
      <div className="aipane__footer">
        <button
          className="aipane__submit"
          type="submit"
          disabled={isSubmitting || !canSubmit}
        >
          {isSubmitting ? messages.generating : messages.generate}
          <AiCaptureIcon name="arrowRight" size={18} />
        </button>
        <span className="aipane__note">{messages.onlineHint}</span>
      </div>
      {isSubmitting && (
        <div className="aipane__processing" role="status">
          <span className="aipane__spinner" aria-hidden="true" />
          <strong>{messages.processingTitle}</strong>
          <span>{messages.processingHint}</span>
        </div>
      )}
    </form>
  );
}
