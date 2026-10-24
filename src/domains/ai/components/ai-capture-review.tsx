import Link from 'next/link';
import {
  SAMPLE_IMAGE,
  SAMPLE_PROPOSALS,
  SAMPLE_TYPED_TEXT,
  type SampleProposalStatus
} from '../capture-samples';
import { aiMessages } from '../messages';
import { AiCaptureFrame } from './ai-capture-frame';
import { AiCaptureIcon } from './ai-capture-icon';
import { AiCaptureSteps } from './ai-capture-steps';
import { AiProposalCard } from './ai-proposal-card';

const messages = aiMessages.review;

export type AiCaptureReviewState = 'default' | 'discard-confirm' | 'discarded';

type AiCaptureReviewProps = {
  /** Mock switch for the bulk-discard states. */
  state?: AiCaptureReviewState;
};

export function AiCaptureReview({ state = 'default' }: AiCaptureReviewProps) {
  const isDiscarded = state === 'discarded';
  const statuses: SampleProposalStatus[] = SAMPLE_PROPOSALS.map(proposal =>
    isDiscarded ? 'rejected' : proposal.status
  );
  const total = statuses.length;
  const accepted = statuses.filter(status => status === 'accepted').length;
  const rejected = statuses.filter(status => status === 'rejected').length;
  const pending = total - accepted - rejected;
  const counts = messages.counts(total, accepted, rejected);
  const createLabel = messages.createCards(accepted);
  const hint = messages.saveHint(pending);
  const isSaveDisabled = accepted === 0;

  const saveLink = (
    <Link
      className="aicap-button aicap-button--primary aicap-button--lg aicap-footer__main"
      href="/cards/ai?step=created"
      aria-disabled="true"
      data-disabled={isSaveDisabled}
      tabIndex={-1}
    >
      <AiCaptureIcon name="check" size={18} />
      {createLabel}
    </Link>
  );

  return (
    <AiCaptureFrame
      layout="wide"
      spacing="tight"
      mobileTitle={messages.title}
      mobileSubtitle={counts}
      backHref="/cards/ai?step=add"
      backLabel={aiMessages.frame.backToAddLabel}
      isFooterMobileOnly
      footer={
        <>
          {saveLink}
          <span className="aicap-footer__hint">{hint}</span>
        </>
      }
    >
      <AiCaptureSteps active={2} isMobileOnly />

      <div className="aicap-review" data-state={state}>
        <section className="aicap-input" aria-labelledby="aicap-input-title">
          <div className="aicap-input__heading">
            <h2 id="aicap-input-title">{messages.desktopInputTitle}</h2>
            <span>{messages.desktopInputHint}</span>
          </div>
          <div className="aicap-input__field">
            <label htmlFor="aicap-review-text">{messages.desktopWords}</label>
            <textarea
              id="aicap-review-text"
              className="aicap-textarea aicap-textarea--compact"
              rows={3}
              defaultValue={SAMPLE_TYPED_TEXT}
            />
            <span className="aicap-input__hint">
              {messages.desktopWordsHint}
            </span>
          </div>
          <div className="aicap-input__field">
            <span className="aicap-input__label">{messages.desktopImage}</span>
            <div className="aicap-file aicap-file--compact">
              <div className="aicap-file__thumb" aria-hidden="true">
                <span />
                <span />
                <span />
                <span />
              </div>
              <span className="aicap-file__copy">
                <span className="aicap-file__name">{SAMPLE_IMAGE.name}</span>
                <span className="aicap-file__detail">
                  {messages.desktopImageFound}
                </span>
              </span>
              <button
                className="aicap-button aicap-button--outline aicap-button--xs"
                type="button"
                disabled
              >
                {messages.desktopChange}
              </button>
            </div>
          </div>
          <button
            className="aicap-button aicap-button--outline aicap-button--md aicap-input__regenerate"
            type="button"
            disabled
          >
            <AiCaptureIcon name="retry" size={16} />
            {messages.desktopRegenerate}
          </button>
          <div className="aicap-note aicap-note--compact">
            <span className="aicap-note__icon">
              <AiCaptureIcon name="info" size={18} />
            </span>
            <span className="aicap-note__text">
              {messages.desktopNote}
              <strong>{messages.desktopNoteStrong}</strong>
              {messages.desktopNoteEnd}
            </span>
          </div>
        </section>

        <section
          className="aicap-review__main"
          aria-labelledby="aicap-review-title"
        >
          <div className="aicap-review__head">
            <div className="aicap-review__heading">
              <h2 id="aicap-review-title">{messages.desktopReviewTitle}</h2>
              <span>{counts}</span>
            </div>
            <div className="aicap-bulk">
              <button className="aicap-bulk__accept" type="button" disabled>
                <AiCaptureIcon name="check" size={16} />
                {messages.acceptAll}
              </button>
              <button className="aicap-bulk__discard" type="button" disabled>
                <AiCaptureIcon name="trash" size={16} />
                {messages.discardAll}
              </button>
            </div>
          </div>

          {state === 'discard-confirm' && (
            <div
              className="aicap-confirm"
              role="alertdialog"
              aria-labelledby="aicap-confirm-title"
            >
              <div className="aicap-confirm__copy">
                <span className="aicap-confirm__title" id="aicap-confirm-title">
                  {messages.confirmTitle}
                </span>
                <span className="aicap-confirm__body aicap-only-compact">
                  {messages.confirmBody}
                </span>
                <span className="aicap-confirm__body aicap-only-wide">
                  {messages.confirmBodyWide}
                </span>
              </div>
              <div className="aicap-confirm__actions">
                <Link
                  className="aicap-confirm__cancel"
                  href="/cards/ai?step=review"
                >
                  {messages.confirmCancel}
                </Link>
                <Link
                  className="aicap-confirm__accept"
                  href="/cards/ai?step=review&state=discarded"
                  aria-disabled="true"
                  tabIndex={-1}
                >
                  {messages.confirmAccept}
                </Link>
              </div>
            </div>
          )}

          {isDiscarded && (
            <div className="aicap-discarded">
              <span className="aicap-discarded__icon">
                <AiCaptureIcon name="trash" size={26} />
              </span>
              <span className="aicap-discarded__title">
                {messages.discardedTitle}
              </span>
              <span className="aicap-discarded__body">
                {messages.discardedBody}
              </span>
              <div className="aicap-discarded__actions">
                <Link
                  className="aicap-button aicap-button--outline"
                  href="/cards/ai?step=review"
                  aria-disabled="true"
                  tabIndex={-1}
                >
                  {messages.undo}
                </Link>
                <Link
                  className="aicap-button aicap-button--primary"
                  href="/cards/ai?step=add"
                >
                  {messages.startOver}
                </Link>
              </div>
            </div>
          )}

          <div className="aicap-proposals">
            {SAMPLE_PROPOSALS.map((proposal, index) => (
              <AiProposalCard
                key={proposal.id}
                proposal={proposal}
                status={statuses[index]}
              />
            ))}
          </div>

          <div className="aicap-savebar">
            <span className="aicap-savebar__hint">{hint}</span>
            <div className="aicap-savebar__actions">
              <Link
                className="aicap-button aicap-button--outline aicap-button--lg"
                href="/cards"
              >
                {messages.cancel}
              </Link>
              {saveLink}
            </div>
          </div>
        </section>
      </div>
    </AiCaptureFrame>
  );
}
