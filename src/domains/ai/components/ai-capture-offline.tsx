import Link from 'next/link';
import { SAMPLE_IMAGE, SAMPLE_QUEUED_WORDS } from '../capture-samples';
import { aiMessages } from '../messages';
import { AiCaptureFrame } from './ai-capture-frame';
import { AiCaptureIcon } from './ai-capture-icon';

const messages = aiMessages.offline;

type AiCaptureOfflineProps = {
  /** Mock switch: `queued` shows the confirmation after choosing to generate later. */
  isQueued?: boolean;
};

export function AiCaptureOffline({ isQueued = false }: AiCaptureOfflineProps) {
  return (
    <AiCaptureFrame
      mobileTitle={aiMessages.frame.mobileAiTitle}
      backHref="/cards"
      backLabel={aiMessages.frame.backToCardsLabel}
      connection="offline"
      spacing="roomy"
      footer={
        <>
          <Link
            className="aicap-button aicap-button--primary aicap-button--lg aicap-footer__main"
            href="/cards"
          >
            {messages.createManually}
          </Link>
          <Link
            className="aicap-button aicap-button--outline aicap-button--md aicap-footer__main"
            href={
              isQueued ? '/cards/ai?state=offline' : '/cards/ai?state=queued'
            }
            aria-pressed={isQueued}
          >
            {isQueued ? messages.cancelQueue : messages.queue}
          </Link>
        </>
      }
    >
      <section className="aicap-hero">
        <div className="aicap-hero__icon">
          <AiCaptureIcon name="wifiOff" size={40} />
        </div>
        <h2 className="aicap-display aicap-display--md">{messages.title}</h2>
        <p className="aicap-hero__body aicap-hero__body--lg">{messages.body}</p>
      </section>

      <section
        className="aicap-panel aicap-panel--queue"
        aria-label={messages.queueLabel}
      >
        <span className="aicap-eyebrow">{messages.queueTitle}</span>
        <div className="aicap-chips">
          {SAMPLE_QUEUED_WORDS.map(word => (
            <span className="aicap-chip aicap-chip--sand" key={word}>
              {word}
            </span>
          ))}
          <span className="aicap-chip aicap-chip--sand">
            <AiCaptureIcon name="image" size={14} />
            {SAMPLE_IMAGE.name}
          </span>
        </div>
      </section>

      {isQueued && (
        <div className="aicap-callout aicap-callout--success" role="status">
          <AiCaptureIcon name="check" />
          <span>{messages.queuedNotice}</span>
        </div>
      )}
    </AiCaptureFrame>
  );
}
