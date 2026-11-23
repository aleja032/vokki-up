import Image from 'next/image';
import { ActionPill } from '@/components/ui/action-pill';
import { Pill } from '@/components/ui/pill';
import { PixelLabel } from '@/components/ui/pixel-label';
import { StatCard } from '@/components/ui/stat-card';
import { cardsMessages } from '../messages';
import type { MemoryGain } from '../review-memory-gains';
import { ReviewMemoryGains } from './review-memory-gains';
import './review-results.css';

const messages = cardsMessages.review;

type ReviewCompleteScreenProps = {
  reviewed: number;
  hard: number;
  good: number;
  easy: number;
  streakDays: number;
  bestCombo: number;
  memoryGains: MemoryGain[];
  onRestart: () => void;
  exitHref: string;
  exitTarget: 'cards' | 'home';
};

// Round results (proposal D). Every number comes from the finished round:
// recalled = rated good or easy, best combo = longest run of recalled cards,
// streak = the real streak derived from the review events.
export function ReviewCompleteScreen({
  reviewed,
  hard,
  good,
  easy,
  streakDays,
  bestCombo,
  memoryGains,
  onRestart,
  exitHref,
  exitTarget
}: ReviewCompleteScreenProps) {
  const recalled = good + easy;

  return (
    <section className="round-results" aria-labelledby="review-done-title">
      <div className="round-results__stage">
        <span aria-hidden="true" className="round-results__glow" />
        <Image
          alt=""
          aria-hidden="true"
          className="round-results__pet motion-mascot-bob"
          height={587}
          src="/images/noma.png"
          width={700}
        />
      </div>
      <div className="round-results__body">
        <header className="round-results__heading">
          <PixelLabel className="round-results__kicker">
            {messages.done.title}
          </PixelLabel>
          <h1 className="round-results__title" id="review-done-title">
            {messages.done.rescued(reviewed)}
          </h1>
        </header>
        <div className="round-results__stats">
          <StatCard
            label={messages.done.accuracyLabel}
            value={messages.done.accuracyValue(recalled, reviewed)}
          />
          {bestCombo > 0 && (
            <StatCard
              label={messages.done.bestComboLabel}
              value={messages.done.bestComboValue(bestCombo)}
            />
          )}
          {streakDays > 0 && (
            <StatCard
              label={messages.done.streakLabel}
              value={messages.done.streakDays(streakDays)}
            />
          )}
        </div>
        <p className="round-results__text">
          {messages.done.reviewed(reviewed)}
          {streakDays > 0 && (
            <>
              {' '}
              {messages.done.streakPrefix}{' '}
              <strong>{messages.done.streakDays(streakDays)}</strong>.
            </>
          )}{' '}
          {messages.done.nextReturn}
        </p>
        <div className="round-results__chips">
          <Pill tone="coral">{messages.done.hardChip(hard)}</Pill>
          <Pill tone="brand">{messages.done.goodChip(good)}</Pill>
          <Pill tone="mint">{messages.done.easyChip(easy)}</Pill>
        </div>
        <ReviewMemoryGains gains={memoryGains} />
        <div className="round-results__actions">
          <ActionPill
            className="round-results__primary"
            href={exitHref}
            variant="primary"
          >
            {exitTarget === 'cards'
              ? messages.done.backCards
              : messages.done.backHome}
          </ActionPill>
          <ActionPill
            className="round-results__repeat"
            onClick={onRestart}
            size="sm"
          >
            {messages.done.repeat}
            <span className="round-results__repeat-suffix">
              {messages.done.repeatSuffix}
            </span>
          </ActionPill>
        </div>
        <p className="round-results__note">{messages.done.repeatNote}</p>
      </div>
    </section>
  );
}
