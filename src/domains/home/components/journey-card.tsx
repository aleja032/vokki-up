import Image from 'next/image';
import { Check } from 'lucide-react';
import { translateText } from '@/lib/i18n/locale';
import type { HomeMission } from '@/lib/home/home-hand.types';
import { homeDashboardData } from '../data';
import './advance-card.css';
import './journey-card.css';

const { copy } = homeDashboardData;

// Splits the bubble sentence around the next word so it can be highlighted.
function splitAround(sentence: string, term: string | null): string[] {
  const index = term ? sentence.indexOf(term) : -1;
  if (!term || index < 0) return [sentence];
  return [sentence.slice(0, index), term, sentence.slice(index + term.length)];
}

export function JourneyCard({ mission }: { mission: HomeMission }) {
  const total = mission.steps.length;
  const sentence = translateText(
    copy.mission.bubble(mission.doneCount, total, mission.nextTerm)
  );
  const [before, highlighted, after] = splitAround(sentence, mission.nextTerm);

  return (
    <article className="advance-card journey-card">
      <h2 className="advance-card__title">{copy.journeyHeading}</h2>
      <ol className="journey-card__path">
        {mission.steps.map((step, index) => (
          <li
            className="journey-card__step"
            data-state={step.state}
            data-first={index === 0 || undefined}
            key={step.term}
          >
            <span className="journey-card__node">
              {step.state === 'done' ? (
                <Check aria-hidden="true" size={18} strokeWidth={3} />
              ) : null}
            </span>
            <span className="journey-card__term">{step.term}</span>
          </li>
        ))}
      </ol>
      <div className="journey-card__noma">
        <Image
          alt={copy.mission.noma}
          className="journey-card__mascot"
          height={700}
          src="/images/noma-cheer.png"
          width={648}
        />
        <p className="journey-card__bubble">
          {before}
          {highlighted ? (
            <span className="journey-card__word">{highlighted}</span>
          ) : null}
          {after}
        </p>
      </div>
    </article>
  );
}
