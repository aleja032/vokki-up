import Link from 'next/link';
import { SAMPLE_UPLOAD_WARNINGS } from '../capture-samples';
import { aiMessages } from '../messages';
import { AiCaptureFrame } from './ai-capture-frame';
import { AiCaptureIcon } from './ai-capture-icon';

const messages = aiMessages.noWords;

export function AiCaptureNoWords() {
  return (
    <AiCaptureFrame
      mobileTitle={aiMessages.frame.mobileAiTitle}
      backHref="/cards/ai?step=add"
      backLabel={aiMessages.frame.backLabel}
      spacing="medium"
      footer={
        <>
          <Link
            className="aicap-button aicap-button--primary aicap-button--lg aicap-footer__main"
            href="/cards/ai?step=add&state=empty"
          >
            <AiCaptureIcon name="camera" size={18} />
            {messages.retakePhoto}
          </Link>
          <Link
            className="aicap-button aicap-button--outline aicap-button--md aicap-footer__main"
            href="/cards/ai?step=processing"
          >
            {messages.continueWithWords}
          </Link>
        </>
      }
    >
      <section className="aicap-hero aicap-hero--compact" role="alert">
        <div className="aicap-blurred">
          <div className="aicap-blurred__page" aria-hidden="true">
            <span />
            <span />
            <span />
            <span />
          </div>
          <span className="aicap-blurred__badge">
            <AiCaptureIcon name="close" size={18} />
          </span>
        </div>
        <h2 className="aicap-display aicap-display--sm">{messages.title}</h2>
        <p className="aicap-hero__body">{messages.body}</p>
      </section>

      <section
        className="aicap-panel aicap-panel--tips"
        aria-labelledby="aicap-tips"
      >
        <h3 className="aicap-panel__title" id="aicap-tips">
          {messages.tipsTitle}
        </h3>
        <ul className="aicap-tips">
          {messages.tips.map(tip => (
            <li key={tip}>{tip}</li>
          ))}
        </ul>
      </section>

      <section className="aicap-warnings" aria-labelledby="aicap-warnings">
        <h3 className="aicap-eyebrow" id="aicap-warnings">
          {messages.warningsTitle}
        </h3>
        {SAMPLE_UPLOAD_WARNINGS.map(warning => (
          <div
            className="aicap-warning"
            data-tone={warning.tone}
            key={warning.id}
          >
            <span className="aicap-warning__icon">
              <AiCaptureIcon
                name={warning.tone === 'error' ? 'warning' : 'info'}
                size={18}
              />
            </span>
            <span className="aicap-warning__copy">
              <span className="aicap-warning__file">{warning.fileName}</span>
              <span className="aicap-warning__message">{warning.message}</span>
            </span>
          </div>
        ))}
      </section>
    </AiCaptureFrame>
  );
}
