import { aiMessages } from '../messages';
import type { CaptureProposal } from '../types';
import { translateText } from '@/lib/i18n/locale';

const messages = aiMessages.proposals;

type AiCaptureProposalItemProps = {
  proposal: CaptureProposal;
  editing: boolean;
  partsOfSpeech: readonly string[];
  onEdit: () => void;
  onUpdate: (update: Partial<CaptureProposal>) => void;
  onStatus: (status: CaptureProposal['status']) => void;
};

export function AiCaptureProposalItem({
  proposal,
  editing,
  partsOfSpeech,
  onEdit,
  onUpdate,
  onStatus
}: AiCaptureProposalItemProps) {
  const isAccepted = proposal.status === 'accepted';
  if (proposal.status === 'rejected') {
    return (
      <div className="aicap-rejected">
        <span className="aicap-rejected__text">
          <s>{proposal.word}</s>
          {messages.discardedSuffix}
        </span>
        <button
          className="aicap-rejected__undo"
          type="button"
          onClick={() => onStatus('pending')}
        >
          {messages.undo}
        </button>
      </div>
    );
  }
  const tone = isAccepted ? 'accepted' : 'pending';
  return (
    <article className="aicap-proposal" data-tone={tone}>
      <div className="aicap-proposal__top">
        <span className="aicap-proposal__source">
          {proposal.source === 'image'
            ? messages.sourceImage
            : messages.sourceTyped}
        </span>
        <span className="aicap-proposal__pill" data-tone={tone}>
          {isAccepted ? messages.selected : messages.pending}
        </span>
      </div>
      {proposal.original && (
        <div className="aicap-correction">
          <span className="aicap-correction__text">
            <strong>{messages.correction}</strong> <s>{proposal.original}</s> →{' '}
            <strong>{proposal.word}</strong>
          </span>
        </div>
      )}
      <div className="aicap-proposal__head">
        <div className="aicap-proposal__word">
          {editing ? (
            <input
              className="aicap-textarea"
              value={proposal.word}
              onChange={event => onUpdate({ word: event.target.value })}
              aria-label={messages.wordLabel}
            />
          ) : (
            <span className="aicap-proposal__term" title={proposal.word}>
              {proposal.word}
            </span>
          )}
          <span className="aicap-proposal__ipa">
            {proposal.phonetics || messages.noPhonetics}
          </span>
        </div>
        <span
          className="aicap-proposal__category"
          data-category={proposal.partOfSpeech}
          title={translateText(proposal.partOfSpeech)}
        >
          {translateText(proposal.partOfSpeech)}
        </span>
      </div>
      {editing ? (
        <>
          <input
            className="aicap-textarea"
            value={proposal.meaning}
            onChange={event => onUpdate({ meaning: event.target.value })}
            aria-label={messages.meaningLabel}
          />
          <input
            className="aicap-textarea"
            value={proposal.example}
            onChange={event => onUpdate({ example: event.target.value })}
            aria-label={messages.exampleLabel}
          />
          <select
            className="aicap-textarea"
            value={proposal.partOfSpeech}
            onChange={event => onUpdate({ partOfSpeech: event.target.value })}
            aria-label={messages.categoryLabel}
          >
            {partsOfSpeech.map(part => (
              <option key={part} value={part}>
                {translateText(part)}
              </option>
            ))}
          </select>
          <input
            className="aicap-textarea"
            value={proposal.relatedWords.join(', ')}
            onChange={event =>
              onUpdate({
                relatedWords: event.target.value
                  .split(',')
                  .map(value => value.trim())
                  .filter(Boolean)
                  .slice(0, 2)
              })
            }
            aria-label={messages.relatedLabel}
          />
        </>
      ) : (
        <>
          <span className="aicap-proposal__meaning" title={proposal.meaning}>
            {proposal.meaning}
          </span>
          <span className="aicap-proposal__example" title={proposal.example}>
            {proposal.example}
          </span>
          <div className="aicap-proposal__related">
            <span className="aicap-proposal__related-label">
              {messages.related}
            </span>
            {proposal.relatedWords.map(word => (
              <span className="aicap-proposal__related-chip" key={word}>
                {word}
              </span>
            ))}
          </div>
        </>
      )}
      <div className="aicap-proposal__actions">
        <button
          className="aicap-action aicap-action--reject"
          type="button"
          onClick={() => onStatus('rejected')}
        >
          {messages.discard}
        </button>
        <button className="aicap-action" type="button" onClick={onEdit}>
          {editing ? messages.done : messages.edit}
        </button>
        <button
          className="aicap-action aicap-action--accept"
          type="button"
          onClick={() => onStatus(isAccepted ? 'pending' : 'accepted')}
        >
          {isAccepted ? messages.remove : messages.accept}
        </button>
      </div>
    </article>
  );
}
