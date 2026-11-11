'use client';

import Link from 'next/link';
import { useCardCaptureFlow } from '../hooks/use-card-capture-flow';
import type { CapturedCardSummary, CaptureLibrary } from '../types';
import { aiMessages } from '../messages';
import { AiCaptureFrame } from './ai-capture-frame';
import { AiCaptureIcon } from './ai-capture-icon';
import { AiCaptureReviewPanel } from './ai-capture-review-panel';
import { AiCaptureSteps } from './ai-capture-steps';
import { translateText } from '@/lib/i18n/locale';

const messages = aiMessages;

type AiCaptureWorkflowProps = {
  /** Card library adapter provided by the route layer. */
  library: CaptureLibrary;
};

export function AiCaptureWorkflow({ library }: AiCaptureWorkflowProps) {
  const flow = useCardCaptureFlow(library);

  if (flow.step === 'review') {
    return <ReviewStep flow={flow} />;
  }

  if (flow.step === 'created') {
    return <CreatedStep cards={flow.createdCards} reset={flow.reset} />;
  }

  return <AddStep flow={flow} />;
}

type CaptureFlow = ReturnType<typeof useCardCaptureFlow>;

function AddStep({ flow }: { flow: CaptureFlow }) {
  const selectedFile = flow.image;

  return (
    <AiCaptureFrame
      mobileTitle={messages.frame.mobileTitle}
      backHref="/cards"
      backLabel={messages.frame.backToCardsLabel}
      connection="online"
      hasMobileTabs
      footer={
        <>
          <button
            className="aicap-button aicap-button--primary aicap-button--lg aicap-footer__main"
            type="submit"
            form="card-ai-capture"
            disabled={flow.isSubmitting || (!flow.text.trim() && !selectedFile)}
          >
            {flow.isSubmitting
              ? messages.workflow.processing
              : messages.workflow.generate}
            <AiCaptureIcon name="arrowRight" size={18} />
          </button>
          <span className="aicap-footer__hint">
            {messages.workflow.onlineHint}
          </span>
        </>
      }
    >
      <form
        id="card-ai-capture"
        className="aicap-form"
        onSubmit={event => {
          event.preventDefault();
          void flow.generate();
        }}
      >
        <AiCaptureSteps active={1} />
        <section className="aicap-block" aria-labelledby="aicap-image">
          <h2 className="aicap-block__title" id="aicap-image">
            {messages.workflow.imageTitle}
          </h2>
          {!selectedFile ? (
            <div className="aicap-dropzone">
              <span className="aicap-dropzone__icon">
                <AiCaptureIcon name="image" size={26} />
              </span>
              <span className="aicap-dropzone__text">
                {messages.workflow.dropzoneText}
              </span>
              <label
                className="aicap-button aicap-button--outline"
                htmlFor="card-ai-image"
              >
                <AiCaptureIcon name="upload" size={18} />
                {messages.workflow.chooseImage}
              </label>
              <input
                id="card-ai-image"
                className="sr-only"
                type="file"
                accept="image/jpeg,image/png"
                capture="environment"
                onChange={event =>
                  flow.setImage(event.target.files?.[0] ?? null)
                }
              />
              <span className="aicap-dropzone__limits">
                {messages.workflow.imageLimits}
              </span>
            </div>
          ) : (
            <div className="aicap-file">
              <div className="aicap-file__thumb" aria-hidden="true">
                <AiCaptureIcon name="image" size={20} />
              </div>
              <span className="aicap-file__copy">
                <span className="aicap-file__name" title={selectedFile.name}>
                  {selectedFile.name}
                </span>
                <span className="aicap-file__detail">
                  {messages.workflow.fileDetail(
                    Math.ceil(selectedFile.size / 1024)
                  )}
                </span>
              </span>
              <button
                className="aicap-file__remove"
                type="button"
                onClick={() => flow.setImage(null)}
                aria-label={messages.workflow.discardImage}
              >
                <AiCaptureIcon name="close" size={18} />
              </button>
            </div>
          )}
        </section>

        <div className="aicap-divider">
          <span />
          {messages.workflow.divider}
          <span />
        </div>

        <section className="aicap-block" aria-labelledby="aicap-words">
          <label
            className="aicap-block__title"
            id="aicap-words"
            htmlFor="aicap-text"
          >
            {messages.workflow.wordsLabel}
          </label>
          <textarea
            id="aicap-text"
            className="aicap-textarea"
            rows={4}
            value={flow.text}
            onChange={event => flow.setText(event.target.value)}
            placeholder={messages.workflow.wordsPlaceholder}
          />
          <span className="aicap-block__hint">
            {messages.workflow.wordsHint}
          </span>
        </section>

        <section className="aicap-block" aria-labelledby="aicap-group">
          <label
            className="aicap-block__title"
            id="aicap-group"
            htmlFor="aicap-group-select"
          >
            {messages.workflow.groupLabel}
          </label>
          <select
            id="aicap-group-select"
            className="aicap-textarea"
            value={flow.selectedGroupId}
            onChange={event => flow.setSelectedGroupId(event.target.value)}
          >
            {flow.groups.map(group => (
              <option value={group.id} key={group.id}>
                {group.name}
              </option>
            ))}
          </select>
          <span className="aicap-block__hint">
            {messages.workflow.groupHint}
          </span>
        </section>

        {flow.error && (
          <p className="aicap-alert" role="alert">
            {flow.error}
          </p>
        )}
      </form>
    </AiCaptureFrame>
  );
}

function ReviewStep({ flow }: { flow: CaptureFlow }) {
  const accepted = flow.proposals.filter(
    proposal => proposal.status === 'accepted'
  ).length;
  const pending = flow.proposals.filter(
    proposal => proposal.status === 'pending'
  ).length;

  return (
    <AiCaptureFrame
      layout="wide"
      spacing="tight"
      mobileTitle={messages.workflow.reviewTitle}
      mobileSubtitle={messages.workflow.reviewSubtitle(
        accepted,
        flow.proposals.length
      )}
      backHref="/cards/ai"
      backLabel={messages.workflow.backToCapture}
      isFooterMobileOnly
      footer={
        <>
          <button
            className="aicap-button aicap-button--primary aicap-button--lg aicap-footer__main"
            type="button"
            onClick={flow.createCards}
            disabled={!accepted}
          >
            {messages.workflow.createCards(accepted)}
          </button>
          <span className="aicap-footer__hint">
            {messages.workflow.pendingHint(pending)}
          </span>
        </>
      }
    >
      <AiCaptureSteps active={2} isMobileOnly />
      <AiCaptureReviewPanel
        proposals={flow.proposals}
        partsOfSpeech={flow.partsOfSpeech}
        error={flow.error}
        cancel={
          <Link
            className="aicap-button aicap-button--outline aicap-button--lg"
            href="/cards"
          >
            {messages.workflow.cancel}
          </Link>
        }
        onAcceptAll={flow.acceptAll}
        onRejectAll={flow.rejectAll}
        onUpdate={flow.updateProposal}
        onStatus={flow.setProposalStatus}
        onCreate={flow.createCards}
      />
    </AiCaptureFrame>
  );
}

function CreatedStep({
  cards,
  reset
}: {
  cards: CapturedCardSummary[];
  reset: () => void;
}) {
  return (
    <AiCaptureFrame
      mobileTitle={messages.workflow.createdTitle}
      backHref="/cards"
      backLabel={messages.workflow.backToCards}
      spacing="medium"
      footer={
        <>
          <Link
            className="aicap-button aicap-button--primary aicap-button--lg aicap-footer__main"
            href="/cards"
          >
            {messages.workflow.viewCards}{' '}
            <AiCaptureIcon name="arrowRight" size={18} />
          </Link>
          <button
            className="aicap-button aicap-button--outline aicap-button--md"
            type="button"
            onClick={reset}
          >
            {messages.workflow.createMore}
          </button>
        </>
      }
    >
      <AiCaptureSteps active={3} />
      <section className="aicap-hero aicap-hero--padded">
        <div className="aicap-hero__icon aicap-hero__icon--success">
          <AiCaptureIcon name="check" size={48} />
        </div>
        <h2 className="aicap-display aicap-display--lg">
          {messages.workflow.createdHeading(cards.length)}
        </h2>
        <p className="aicap-hero__body aicap-hero__body--lg">
          {messages.workflow.createdBody}
        </p>
      </section>
      <section
        className="aicap-list"
        aria-label={messages.workflow.createdListLabel}
      >
        {cards.map(card => (
          <div className="aicap-list__row" key={card.id}>
            <span className="aicap-list__copy">
              <span className="aicap-list__word" title={card.term}>
                {card.term}
              </span>
              <span className="aicap-list__meaning" title={card.meaning}>
                {card.meaning}
              </span>
            </span>
            <span
              className="aicap-list__category"
              data-category={card.partOfSpeech}
              title={translateText(card.partOfSpeech)}
            >
              {translateText(card.partOfSpeech)}
            </span>
          </div>
        ))}
      </section>
      <span className="aicap-stored">
        <AiCaptureIcon name="device" size={14} />
        {messages.workflow.storedHere}
      </span>
    </AiCaptureFrame>
  );
}
