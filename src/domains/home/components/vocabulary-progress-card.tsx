import Image from 'next/image';
import { ChevronRight } from 'lucide-react';
import { homeDashboardData } from '../data';
import type { HomeDashboardData } from '../types';
import './advance-card.css';
import './vocabulary-progress-card.css';

const { copy } = homeDashboardData;
// Noma grows with the mastered words: three sizes, the last one glowing.
const GROWTH = ['small', 'medium', 'large'] as const;

export function VocabularyProgressCard({
  stats
}: {
  stats: HomeDashboardData['stats'];
}) {
  return (
    <article className="advance-card vocabulary-progress">
      <h2 className="advance-card__title">{copy.progressHeading}</h2>
      <div className="vocabulary-progress__stats">
        <div className="vocabulary-progress__stat">
          <p className="vocabulary-progress__value">{stats.masteredWords}</p>
          <p className="vocabulary-progress__caption">
            {copy.masteredCaption}
            <br />
            {copy.seenCaption(stats.wordsSeen ?? 0)}
          </p>
        </div>
        <span aria-hidden="true" className="vocabulary-progress__divider" />
        <div className="vocabulary-progress__stat">
          <p className="vocabulary-progress__value vocabulary-progress__value--accent">
            {stats.accuracy === null ? '—' : `${stats.accuracy}%`}
          </p>
          <p className="vocabulary-progress__caption">
            {copy.accuracyCaption}
            <br />
            {copy.accuracyPeriod}
          </p>
        </div>
      </div>
      <div aria-hidden="true" className="vocabulary-progress__growth">
        {GROWTH.map((size, index) => (
          <span className="vocabulary-progress__step" key={size}>
            <Image
              alt=""
              className="vocabulary-progress__noma"
              data-size={size}
              height={587}
              src="/images/noma.png"
              width={700}
            />
            {index < GROWTH.length - 1 ? (
              <ChevronRight size={18} strokeWidth={2.4} />
            ) : null}
          </span>
        ))}
      </div>
      <p className="vocabulary-progress__note">{copy.progressNote}</p>
    </article>
  );
}
