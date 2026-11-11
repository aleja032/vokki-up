import { countCaptureTerms, MAX_CAPTURE_TERMS } from '../capture-terms';
import { aiMessages } from '../messages';
import { AiPaneFrame, type AiPaneFrameProps } from './ai-pane-frame';

const messages = aiMessages.panes;

type AiWordsPaneProps = Omit<
  AiPaneFrameProps,
  'title' | 'hint' | 'canSubmit' | 'children'
> & {
  text: string;
  onTextChange: (text: string) => void;
};

/** Mode 2: a free list of words in any order; the AI organizes it into proposals. */
export function AiWordsPane({
  text,
  onTextChange,
  ...frame
}: AiWordsPaneProps) {
  const count = countCaptureTerms(text);
  const isOverLimit = count > MAX_CAPTURE_TERMS;
  return (
    <AiPaneFrame
      title={messages.wordsTitle}
      hint={messages.wordsHint}
      canSubmit={count > 0 && !isOverLimit}
      {...frame}
    >
      <label className="aipane__label" htmlFor="aipane-words">
        {messages.wordsLabel}
      </label>
      <textarea
        id="aipane-words"
        className="aipane__textarea"
        value={text}
        onChange={event => onTextChange(event.target.value)}
        placeholder={messages.wordsPlaceholder}
        aria-describedby="aipane-words-counter"
      />
      <div className="aipane__meta">
        <span className="aipane__note">{messages.wordsNote}</span>
        <span
          id="aipane-words-counter"
          className="aipane__counter"
          data-invalid={isOverLimit}
        >
          {messages.wordsCounter(count, MAX_CAPTURE_TERMS)}
        </span>
      </div>
    </AiPaneFrame>
  );
}
