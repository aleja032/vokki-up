import Link from 'next/link';
import { SAMPLE_FEEDBACK } from '../data';
import { writingMessages } from '../messages';
import { PlusIcon } from './writing-icons';

const copy = writingMessages.feedback;

export function WritingFeedbackPanel() {
  const feedback = SAMPLE_FEEDBACK;
  const metrics = [
    {
      name: copy.metrics.clarity,
      value: feedback.metrics.clarity,
      tone: 'indigo'
    },
    {
      name: copy.metrics.vocabulary,
      value: feedback.metrics.vocabulary,
      tone: 'indigo'
    },
    {
      name: copy.metrics.grammar,
      value: feedback.metrics.grammar,
      tone: 'amber'
    }
  ];

  return (
    <section className="essay-feedback" aria-labelledby="essay-feedback-title">
      <div className="essay-feedback__score-row">
        <div
          className="essay-score-ring"
          role="img"
          aria-label={copy.scoreOutOf(feedback.overall)}
        >
          <svg viewBox="0 0 80 80" aria-hidden="true">
            <circle
              className="essay-score-ring__track"
              cx="40"
              cy="40"
              r="34"
            />
            <circle
              className="essay-score-ring__value"
              cx="40"
              cy="40"
              r="34"
            />
          </svg>
          <div className="essay-score-ring__label" aria-hidden="true">
            <span className="essay-score-ring__number">{feedback.overall}</span>
            <span className="essay-score-ring__max">/100</span>
          </div>
        </div>
        <div className="essay-feedback__headline">
          <h2 id="essay-feedback-title">{copy.headline}</h2>
          <p>
            {copy.deltaCopy}{' '}
            <span className="essay-feedback__detail--mobile">
              {copy.mobileDetail}
            </span>
            <span className="essay-feedback__detail--desktop">
              {copy.desktopDetail}
            </span>
          </p>
        </div>
      </div>
      <div className="essay-metrics">
        {metrics.map(metric => (
          <div
            className="essay-metric"
            data-tone={metric.tone}
            key={metric.name}
          >
            <div className="essay-metric__label">
              <strong>{metric.name}</strong>
              <span>{metric.value}</span>
            </div>
            <progress
              aria-label={copy.metricLabel(metric.name, metric.value)}
              value={metric.value}
              max={100}
            />
          </div>
        ))}
      </div>
      <div className="essay-corrections">
        <h3>{copy.corrections}</h3>
        {feedback.corrections.slice(0, 2).map(correction => (
          <article className="essay-correction" key={correction.original}>
            <p className="essay-correction__change">
              <span className="essay-correction__original">
                {correction.original}
              </span>
              <span aria-hidden="true"> → </span>
              <strong>{correction.suggested}</strong>
            </p>
            <p className="essay-correction__note">{correction.explanation}</p>
          </article>
        ))}
        <Link className="essay-feedback__card-action" href="/cards">
          <PlusIcon size={16} />
          {copy.createCard(copy.createCardWord)}
        </Link>
      </div>
    </section>
  );
}
