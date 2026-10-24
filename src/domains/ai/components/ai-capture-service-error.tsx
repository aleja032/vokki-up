import Link from 'next/link';
import {
  SAMPLE_ATTEMPT,
  SAMPLE_ERROR_CODE,
  SAMPLE_SUPPORT_ID
} from '../capture-samples';
import { aiMessages } from '../messages';
import { AiCaptureFrame } from './ai-capture-frame';
import { AiCaptureIcon } from './ai-capture-icon';
import { AiSupportId } from './ai-support-id';

const messages = aiMessages.serviceError;

type AiCaptureServiceErrorProps = {
  /** Mock switch: `retrying` shows the in-progress retry state. */
  isRetrying?: boolean;
};

export function AiCaptureServiceError({
  isRetrying = false
}: AiCaptureServiceErrorProps) {
  return (
    <AiCaptureFrame
      mobileTitle={aiMessages.frame.mobileAiTitle}
      backHref="/cards/ai?step=add"
      backLabel={aiMessages.frame.backLabel}
      spacing="roomy"
      footer={
        <>
          <Link
            className="aicap-button aicap-button--primary aicap-button--lg aicap-footer__main"
            href="/cards/ai?step=processing"
            aria-disabled="true"
            data-disabled={isRetrying}
            tabIndex={-1}
          >
            <AiCaptureIcon name="retry" size={18} />
            {messages.retry}
          </Link>
          <Link
            className="aicap-button aicap-button--outline aicap-button--md aicap-footer__main"
            href="/cards"
          >
            {messages.createManually}
          </Link>
        </>
      }
    >
      <section className="aicap-hero" role="alert">
        <div className="aicap-hero__icon aicap-hero__icon--danger">
          <AiCaptureIcon name="warning" size={40} />
        </div>
        <h2 className="aicap-display aicap-display--md">{messages.title}</h2>
        <p className="aicap-hero__body aicap-hero__body--lg">{messages.body}</p>
      </section>

      <section
        className="aicap-panel aicap-panel--details"
        aria-label={messages.detailsLabel}
      >
        <div className="aicap-detail">
          <span>{messages.code}</span>
          <strong>{SAMPLE_ERROR_CODE}</strong>
        </div>
        <div className="aicap-detail">
          <span>{messages.attempts}</span>
          <strong>{messages.attemptsValue(SAMPLE_ATTEMPT)}</strong>
        </div>
        <div className="aicap-detail aicap-detail--support">
          <span>{messages.supportId}</span>
          <AiSupportId supportId={SAMPLE_SUPPORT_ID} />
        </div>
      </section>

      {isRetrying && (
        <div className="aicap-callout aicap-callout--info" role="status">
          <span className="aicap-spin aicap-callout__spinner" />
          <span>{messages.retrying}</span>
        </div>
      )}
    </AiCaptureFrame>
  );
}
