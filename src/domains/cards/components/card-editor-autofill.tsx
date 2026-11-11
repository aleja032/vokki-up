import Link from 'next/link';
import { cardsMessages } from '../messages';

const messages = cardsMessages.cardEditor;

type CardEditorAutofillProps = {
  /** Without an AI capability wired by the route the action stays disabled. */
  isAvailable: boolean;
  canRequest: boolean;
  isLoading: boolean;
  hasTerm: boolean;
  status: 'idle' | 'loading' | 'error' | 'unconfigured';
  errorMessage: string;
  conflictCount: number;
  onRequest: () => void;
  onReplace: () => void;
  onKeep: () => void;
};

export function CardEditorAutofill({
  isAvailable,
  canRequest,
  isLoading,
  hasTerm,
  status,
  errorMessage,
  conflictCount,
  onRequest,
  onReplace,
  onKeep
}: CardEditorAutofillProps) {
  const hint = !isAvailable
    ? messages.aiHint
    : !hasTerm
      ? messages.aiSuggestNeedsTerm
      : undefined;
  return (
    <div className="deck-autofill">
      <button
        className="deck-editor__ai"
        type="button"
        disabled={!canRequest}
        aria-busy={isLoading}
        title={hint}
        onClick={onRequest}
      >
        <strong>{messages.modeAiBadge}</strong>
        {messages.aiSuggest}
        <span className="deck-editor__ai-note">
          {messages.aiSuggestOffline}
        </span>
      </button>
      {isAvailable && status === 'idle' && conflictCount === 0 && (
        <span className="deck-autofill__help">{messages.aiSuggestHelp}</span>
      )}
      {isLoading && (
        <span className="deck-autofill__status" role="status">
          {messages.aiSuggestLoading}
        </span>
      )}
      {(status === 'error' || status === 'unconfigured') && (
        <p className="deck-autofill__message" role="alert">
          {errorMessage}{' '}
          {status === 'unconfigured' && (
            <Link className="deck-field__link" href="/settings">
              {messages.aiSettingsLink}
            </Link>
          )}
        </p>
      )}
      {conflictCount > 0 && (
        <div className="deck-autofill__confirm" role="group">
          <span>{messages.aiConflict(conflictCount)}</span>
          <div className="deck-autofill__actions">
            <button type="button" onClick={onReplace}>
              {messages.aiConflictReplace}
            </button>
            <button type="button" onClick={onKeep}>
              {messages.aiConflictKeep}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
