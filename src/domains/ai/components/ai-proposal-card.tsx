import { aiMessages } from '../messages';
import type { SampleProposal, SampleProposalStatus } from '../capture-samples';
import { AiCaptureIcon } from './ai-capture-icon';

const messages = aiMessages.review;

type AiProposalCardProps = {
  proposal: SampleProposal;
  status: SampleProposalStatus;
};

function getPill(proposal: SampleProposal, status: SampleProposalStatus) {
  if (proposal.hasError)
    return { tone: 'error', label: messages.pillIncomplete };
  if (status === 'accepted')
    return { tone: 'accepted', label: messages.pillAccepted };
  return { tone: 'pending', label: messages.pillPending };
}

export function AiProposalCard({ proposal, status }: AiProposalCardProps) {
  if (status === 'rejected') {
    return (
      <div className="aicap-rejected">
        <span className="aicap-rejected__text">
          {messages.rejectedPrefix}
          <s>{proposal.word}</s>
        </span>
        <button className="aicap-rejected__undo" type="button" disabled>
          {messages.undo}
        </button>
      </div>
    );
  }

  const pill = getPill(proposal, status);
  const isAccepted = status === 'accepted';
  const hasExample = !proposal.hasError && proposal.example !== '';

  return (
    <article
      className="aicap-proposal"
      data-tone={pill.tone}
      aria-label={proposal.word}
    >
      <div className="aicap-proposal__top">
        <span className="aicap-proposal__source">
          {proposal.source === 'typed'
            ? messages.sourceTyped
            : messages.sourceImage}
        </span>
        <span className="aicap-proposal__pill" data-tone={pill.tone}>
          {pill.label}
        </span>
      </div>

      {proposal.original !== '' && (
        <div className="aicap-correction">
          <span className="aicap-correction__text">
            <strong>{messages.spellingFixed}</strong> <s>{proposal.original}</s>{' '}
            → <strong>{proposal.word}</strong>
          </span>
          <button className="aicap-correction__toggle" type="button" disabled>
            {messages.keepOriginal}
          </button>
        </div>
      )}

      <div className="aicap-proposal__head">
        <div className="aicap-proposal__word">
          <span className="aicap-proposal__term">{proposal.word}</span>
          <span className="aicap-proposal__ipa">{proposal.phonetics}</span>
        </div>
        <span
          className="aicap-proposal__category"
          data-category={proposal.partOfSpeech}
        >
          {proposal.partOfSpeech}
        </span>
      </div>

      <span className="aicap-proposal__meaning">{proposal.meaning}</span>

      {hasExample && (
        <>
          <span className="aicap-proposal__example">{proposal.example}</span>
          <div className="aicap-proposal__related">
            <span className="aicap-proposal__related-label">
              {messages.related}
            </span>
            {proposal.related.map(word => (
              <span className="aicap-proposal__related-chip" key={word}>
                {word}
              </span>
            ))}
          </div>
        </>
      )}

      {proposal.hasError && (
        <div className="aicap-alert" role="alert">
          <span className="aicap-alert__text">
            <span className="aicap-alert__icon">
              <AiCaptureIcon name="warning" size={18} />
            </span>
            <span className="aicap-only-compact">{messages.rowError}</span>
            <span className="aicap-only-wide">{messages.rowErrorWide}</span>
          </span>
          <div className="aicap-alert__actions">
            <button
              className="aicap-button aicap-button--danger aicap-button--sm"
              type="button"
              disabled
            >
              <span className="aicap-alert__icon">
                <AiCaptureIcon name="retry" size={14} />
              </span>
              {messages.retry}
            </button>
            <button
              className="aicap-button aicap-button--danger-outline aicap-button--sm aicap-only-compact"
              type="button"
              disabled
            >
              {messages.writeIt}
            </button>
          </div>
        </div>
      )}

      <div className="aicap-proposal__actions">
        <button
          className="aicap-action aicap-action--reject"
          type="button"
          disabled
        >
          {messages.reject}
        </button>
        <button className="aicap-action" type="button" disabled>
          {messages.edit}
        </button>
        <button
          className="aicap-action aicap-action--accept"
          type="button"
          disabled
          aria-pressed={isAccepted}
        >
          {isAccepted ? messages.accepted : messages.accept}
        </button>
      </div>
    </article>
  );
}
