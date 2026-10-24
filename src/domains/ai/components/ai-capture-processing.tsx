import Link from 'next/link';
import { SAMPLE_PROCESSING_STEPS, SAMPLE_PROPOSALS } from '../capture-samples';
import { aiMessages } from '../messages';
import { AiCaptureFrame } from './ai-capture-frame';
import { AiCaptureIcon } from './ai-capture-icon';
import { AiCaptureSteps } from './ai-capture-steps';

const messages = aiMessages.processing;
const ACTIVE_STEP_INDEX = 2;

type AiCaptureProcessingProps = {
  /** Mock switch: `ready` shows the finished variant instead of the running one. */
  isReady?: boolean;
};

function getStepStatus(index: number, isReady: boolean) {
  if (isReady || index < ACTIVE_STEP_INDEX) return 'done';
  return index === ACTIVE_STEP_INDEX ? 'active' : 'pending';
}

export function AiCaptureProcessing({
  isReady = false
}: AiCaptureProcessingProps) {
  const proposalCount = SAMPLE_PROPOSALS.length;

  return (
    <AiCaptureFrame
      mobileTitle={aiMessages.frame.mobileAiTitle}
      backHref="/cards/ai?step=add"
      backLabel={aiMessages.frame.backLabel}
      footer={
        isReady ? (
          <Link
            className="aicap-button aicap-button--primary aicap-button--lg aicap-footer__main"
            href="/cards/ai?step=review"
          >
            {messages.review(proposalCount)}
            <AiCaptureIcon name="arrowRight" size={18} />
          </Link>
        ) : (
          <Link
            className="aicap-button aicap-button--outline aicap-button--lg aicap-footer__main"
            href="/cards/ai?step=add"
          >
            {messages.cancel}
          </Link>
        )
      }
    >
      <AiCaptureSteps active={2} isWorking={!isReady} />

      <section className="aicap-panel aicap-panel--progress" aria-live="polite">
        <div className="aicap-panel__heading">
          <h2 className="aicap-display aicap-display--md">
            {isReady ? messages.ready(proposalCount) : messages.working}
          </h2>
          <span className="aicap-panel__sub">
            {isReady ? messages.readyHint : messages.workingHint}
          </span>
        </div>
        <ul className="aicap-progress">
          {SAMPLE_PROCESSING_STEPS.map((step, index) => {
            const status = getStepStatus(index, isReady);
            return (
              <li className="aicap-progress__item" key={step.label}>
                {status === 'done' && (
                  <span className="aicap-progress__mark aicap-progress__mark--done">
                    <AiCaptureIcon name="check" size={16} />
                  </span>
                )}
                {status === 'active' && (
                  <span className="aicap-progress__mark aicap-progress__mark--active aicap-spin" />
                )}
                {status === 'pending' && (
                  <span className="aicap-progress__mark aicap-progress__mark--pending" />
                )}
                <span className="aicap-progress__copy">
                  <span
                    className="aicap-progress__label"
                    data-pending={status === 'pending'}
                  >
                    {step.label}
                  </span>
                  <span className="aicap-progress__detail">{step.detail}</span>
                </span>
              </li>
            );
          })}
        </ul>
      </section>

      {!isReady && (
        <div className="aicap-skeletons" aria-hidden="true">
          <div className="aicap-skeleton aicap-pulse">
            <span className="aicap-skeleton__line aicap-skeleton__line--title" />
            <span className="aicap-skeleton__line" />
            <span className="aicap-skeleton__line" />
          </div>
          <div className="aicap-skeleton aicap-pulse">
            <span className="aicap-skeleton__line aicap-skeleton__line--title" />
            <span className="aicap-skeleton__line" />
            <span className="aicap-skeleton__line" />
          </div>
        </div>
      )}
    </AiCaptureFrame>
  );
}
