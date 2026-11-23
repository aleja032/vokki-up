import Image from 'next/image';
import Link from 'next/link';
import { Library, Play } from 'lucide-react';
import { actionPillClass } from '@/components/ui/action-pill';
import { PixelLabel } from '@/components/ui/pixel-label';
import { cn } from '@/lib/utils';
import { homeDashboardData } from '../data';
import type { HomeDashboardData } from '../types';
import './hero-panel.css';

const { copy } = homeDashboardData;

// Words shown as floating tags when the due hand is empty.
const STARTER_TAGS = ['order', 'receipt', 'table'] as const;

export function HeroPanel({
  data,
  words = []
}: {
  data: HomeDashboardData['nextSession'];
  /** Real words of the due hand; the first three float over the scene. */
  words?: readonly string[];
}) {
  const tags = (words.length > 0 ? words : STARTER_TAGS).slice(0, 3);
  const dueCount = data.pendingCount + data.newCount;

  return (
    <section aria-labelledby="hero-title" className="hero-panel">
      <div aria-hidden="true" className="hero-panel__backdrop">
        <span className="hero-panel__scene">
          <Image
            alt=""
            className="hero-panel__world"
            fill
            sizes="(min-width: 768px) 60vw, 100vw"
            src="/images/world-daily.png"
            unoptimized
          />
        </span>
        <span className="hero-panel__shade" />
        <span className="hero-panel__glow" />
        <span className="hero-panel__star motion-twinkle" />
        <svg
          aria-hidden="true"
          className="hero-panel__wave"
          preserveAspectRatio="none"
          viewBox="0 0 1200 60"
        >
          <path d="M0 60 L0 34 C 140 6, 300 58, 470 32 S 760 4, 930 30 S 1110 54, 1200 24 L1200 60 Z" />
        </svg>
      </div>
      <ul aria-hidden="true" className="hero-panel__tags">
        {tags.map(word => (
          <li className="hero-panel__tag motion-float-tag" key={word}>
            {word}
          </li>
        ))}
      </ul>
      <Image
        alt={copy.heroMascotAlt}
        className="hero-panel__mascot motion-mascot-bob"
        height={587}
        priority
        src="/images/noma.png"
        width={700}
      />
      {dueCount > 0 ? (
        <p className="hero-panel__bubble">{copy.heroBubble}</p>
      ) : null}
      <div className="hero-panel__copy">
        <PixelLabel className="hero-panel__kicker">
          {copy.nextSessionHeading}
        </PixelLabel>
        <h1 className="hero-panel__title" id="hero-title">
          {dueCount > 0 ? (
            <>
              {dueCount} {copy.heroTitleLead(dueCount)}{' '}
              <span className="hero-panel__accent">{copy.heroTitleAccent}</span>{' '}
              {copy.heroTitleTail}
            </>
          ) : (
            data.title
          )}
        </h1>
        <p className="hero-panel__lead">{copy.nextSessionDescription}</p>
        <div className="hero-panel__actions">
          <Link
            className={cn(
              actionPillClass('primary'),
              'hero-panel__cta',
              'motion-cta-pulse'
            )}
            href={data.href}
          >
            <Play aria-hidden="true" fill="currentColor" size={18} />
            {copy.startRound}
          </Link>
          <Link
            className={cn(
              actionPillClass('secondary'),
              'hero-panel__secondary'
            )}
            href="/cards/word-library"
          >
            <Library aria-hidden="true" size={18} strokeWidth={2} />
            {copy.addFromLibrary}
          </Link>
        </div>
      </div>
    </section>
  );
}
