import Link from 'next/link';
import { SAMPLE_CREATED_CARDS, SAMPLE_PROPOSALS } from '../capture-samples';
import { aiMessages } from '../messages';
import { AiCaptureFrame } from './ai-capture-frame';
import { AiCaptureIcon } from './ai-capture-icon';
import { AiCaptureSteps } from './ai-capture-steps';

const messages = aiMessages.created;

export function AiCaptureCreated() {
  const createdCount = SAMPLE_CREATED_CARDS.length;
  const skippedCount = SAMPLE_PROPOSALS.length - createdCount;

  return (
    <AiCaptureFrame
      mobileTitle={aiMessages.frame.mobileAiTitle}
      backHref="/cards/ai?step=review"
      backLabel={aiMessages.frame.backLabel}
      spacing="medium"
      isMobileBarSilent
      footer={
        <>
          <Link
            className="aicap-button aicap-button--primary aicap-button--lg aicap-footer__main"
            href="/review"
          >
            {messages.reviewNow}
            <AiCaptureIcon name="arrowRight" size={18} />
          </Link>
          <div className="aicap-footer__pair">
            <Link
              className="aicap-button aicap-button--outline aicap-button--md"
              href="/cards"
            >
              {messages.viewCards}
            </Link>
            <Link
              className="aicap-button aicap-button--outline aicap-button--md"
              href="/cards/ai?step=add"
            >
              {messages.createMore}
            </Link>
          </div>
        </>
      }
    >
      <AiCaptureSteps active={3} />

      <section className="aicap-hero aicap-hero--padded">
        <div className="aicap-hero__icon aicap-hero__icon--success">
          <AiCaptureIcon name="check" size={48} />
        </div>
        <h2 className="aicap-display aicap-display--lg">
          {messages.title(createdCount)}
        </h2>
        <p className="aicap-hero__body aicap-hero__body--lg">
          {messages.body(skippedCount)}
        </p>
      </section>

      <section className="aicap-list" aria-label={messages.listLabel}>
        {SAMPLE_CREATED_CARDS.map(card => (
          <div className="aicap-list__row" key={card.word}>
            <span className="aicap-list__copy">
              <span className="aicap-list__word">{card.word}</span>
              <span className="aicap-list__meaning">{card.meaning}</span>
            </span>
            <span
              className="aicap-list__category"
              data-category={card.partOfSpeech}
            >
              {card.partOfSpeech}
            </span>
          </div>
        ))}
      </section>

      <span className="aicap-stored">
        <AiCaptureIcon name="device" size={14} />
        {messages.stored}
      </span>
    </AiCaptureFrame>
  );
}
