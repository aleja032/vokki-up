import Link from 'next/link';
import {
  SAMPLE_GROUPS,
  SAMPLE_IMAGE,
  SAMPLE_SELECTED_GROUP_ID,
  SAMPLE_TYPED_TEXT,
  SAMPLE_TYPED_WORDS
} from '../capture-samples';
import { aiMessages } from '../messages';
import { AiCaptureFrame } from './ai-capture-frame';
import { AiCaptureIcon } from './ai-capture-icon';
import { AiCaptureSteps } from './ai-capture-steps';

const messages = aiMessages.add;

type AiCaptureAddProps = {
  /** Mock switch: `empty` shows the screen before anything is added. */
  isEmpty?: boolean;
};

export function AiCaptureAdd({ isEmpty = false }: AiCaptureAddProps) {
  const wordCount = isEmpty ? 0 : SAMPLE_TYPED_WORDS.length;
  const summary = isEmpty
    ? messages.summaryEmpty
    : messages.summary(
        `${messages.wordCount(wordCount)} y ${messages.imageCount}`
      );

  return (
    <AiCaptureFrame
      mobileTitle={aiMessages.frame.mobileTitle}
      backHref="/cards"
      backLabel={aiMessages.frame.backToCardsLabel}
      connection="online"
      hasMobileTabs
      footer={
        <>
          <Link
            className="aicap-button aicap-button--primary aicap-button--lg aicap-footer__main"
            href="/cards/ai?step=processing"
            aria-disabled="true"
            data-disabled={isEmpty}
            tabIndex={-1}
          >
            {messages.generate}
            <AiCaptureIcon name="arrowRight" size={18} />
          </Link>
          <span className="aicap-footer__hint">{summary}</span>
        </>
      }
    >
      <AiCaptureSteps active={1} />

      <section className="aicap-block" aria-labelledby="aicap-words">
        <label
          className="aicap-block__title"
          id="aicap-words"
          htmlFor="aicap-text"
        >
          {messages.wordsLabel}
        </label>
        <textarea
          id="aicap-text"
          className="aicap-textarea"
          rows={3}
          placeholder={messages.wordsPlaceholder}
          defaultValue={isEmpty ? '' : SAMPLE_TYPED_TEXT}
        />
        <span className="aicap-block__hint">{messages.wordsHint}</span>
        {!isEmpty && (
          <div className="aicap-chips">
            {SAMPLE_TYPED_WORDS.map(word => (
              <span className="aicap-chip aicap-chip--indigo" key={word}>
                {word}
              </span>
            ))}
          </div>
        )}
      </section>

      <div className="aicap-divider">
        <span />
        {messages.or}
        <span />
      </div>

      <section className="aicap-block" aria-labelledby="aicap-image">
        <h2 className="aicap-block__title" id="aicap-image">
          {messages.imageTitle}
        </h2>
        {isEmpty ? (
          <div className="aicap-dropzone">
            <span className="aicap-dropzone__icon">
              <AiCaptureIcon name="image" size={26} />
            </span>
            <span className="aicap-dropzone__text">
              {messages.dropzoneHint}
            </span>
            <div className="aicap-dropzone__actions">
              <button
                className="aicap-button aicap-button--outline"
                type="button"
                disabled
              >
                <AiCaptureIcon name="camera" size={18} />
                {messages.takePhoto}
              </button>
              <button
                className="aicap-button aicap-button--outline"
                type="button"
                disabled
              >
                <AiCaptureIcon name="upload" size={18} />
                {messages.chooseImage}
              </button>
            </div>
            <span className="aicap-dropzone__limits">
              {messages.imageLimits}
            </span>
          </div>
        ) : (
          <div className="aicap-file">
            <div className="aicap-file__thumb" aria-hidden="true">
              <span />
              <span />
              <span />
              <span />
            </div>
            <span className="aicap-file__copy">
              <span className="aicap-file__name">{SAMPLE_IMAGE.name}</span>
              <span className="aicap-file__detail">{SAMPLE_IMAGE.detail}</span>
            </span>
            <button
              className="aicap-file__remove"
              type="button"
              disabled
              aria-label={messages.removeImage}
            >
              <AiCaptureIcon name="close" size={18} />
            </button>
          </div>
        )}
      </section>

      <section className="aicap-block" aria-labelledby="aicap-group">
        <h2 className="aicap-block__title" id="aicap-group">
          {messages.groupTitle}
        </h2>
        <div className="aicap-groups">
          {SAMPLE_GROUPS.map(group => (
            <button
              className="aicap-group"
              data-tone={group.tone}
              type="button"
              disabled
              key={group.id}
              aria-pressed={group.id === SAMPLE_SELECTED_GROUP_ID}
            >
              <span className="aicap-group__dot" />
              {group.label}
            </button>
          ))}
          <Link className="aicap-group aicap-group--add" href="/cards">
            <AiCaptureIcon name="plus" size={14} />
            {messages.newGroup}
          </Link>
        </div>
        <span className="aicap-block__hint">{messages.groupHint}</span>
      </section>

      <aside className="aicap-note">
        <span className="aicap-note__icon">
          <AiCaptureIcon name="info" />
        </span>
        <span className="aicap-note__text">
          {messages.infoBody}
          <strong>{messages.infoStrong}</strong>
        </span>
      </aside>
    </AiCaptureFrame>
  );
}
