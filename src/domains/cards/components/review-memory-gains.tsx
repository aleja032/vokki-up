import { ArrowRight } from 'lucide-react';
import { PixelLabel } from '@/components/ui/pixel-label';
import { ProgressBar } from '@/components/ui/progress-bar';
import { cardsMessages } from '../messages';
import { MAX_CARD_MEMORY, getCardMemoryFromLevel } from '../card-memory';
import type { MemoryGain } from '../review-memory-gains';
import './review-memory-gains.css';

const messages = cardsMessages.review.done;

function MemoryBar({ level }: { level: number }) {
  const { tone } = getCardMemoryFromLevel(level);
  return (
    <ProgressBar
      className="memory-gains__bar"
      label={cardsMessages.overview.memoryLabel(level)}
      max={MAX_CARD_MEMORY}
      segments={MAX_CARD_MEMORY}
      shape="blocks"
      tone={tone}
      value={level}
    />
  );
}

// Words that ended the round stronger than they started, before and after.
export function ReviewMemoryGains({ gains }: { gains: MemoryGain[] }) {
  if (gains.length === 0) return null;

  return (
    <section className="memory-gains" aria-labelledby="memory-gains-title">
      <h2 className="memory-gains__title" id="memory-gains-title">
        <PixelLabel className="memory-gains__label">
          {messages.gainsTitle}
        </PixelLabel>
      </h2>
      <ul className="memory-gains__list">
        {gains.map(gain => (
          <li className="memory-gains__item" key={gain.cardId}>
            <strong className="memory-gains__term">{gain.term}</strong>
            <span className="memory-gains__levels">
              <MemoryBar level={gain.from} />
              <ArrowRight
                aria-hidden="true"
                className="memory-gains__arrow"
                size={14}
                strokeWidth={2.2}
              />
              <MemoryBar level={gain.to} />
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
