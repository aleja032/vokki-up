import { writingMessages } from '../messages';

const copy = writingMessages.feedback;

export function WritingFeedbackPanel() {
  return (
    <section
      className="essay-feedback essay-feedback--unavailable"
      aria-labelledby="essay-feedback-title"
    >
      <div className="essay-feedback__placeholder" role="status">
        <h2 id="essay-feedback-title">{copy.title()}</h2>
        <p>{copy.body()}</p>
      </div>
    </section>
  );
}
