import Link from 'next/link';
import { SectionHeading } from '@/components/ui/section-heading';
import type { DueWord } from '@/lib/home/home-hand.types';
import { homeDashboardData } from '../data';
import { SAMPLE_HAND } from '../sample-hand';
import { DueWordCard } from './due-word-card';
import './due-cards-hand.css';

const { copy } = homeDashboardData;

const MIN_REVIEWED_WORDS = 3;

interface DueCardsHandProps {
  hand: DueWord[];
  totalDue: number;
  href: string;
}

export function DueCardsHand({ hand, totalDue, href }: DueCardsHandProps) {
  const legend = [
    ['fragile', copy.legend.fragile],
    ['learning', copy.legend.learning],
    ['firm', copy.legend.firm],
    ['mastered', copy.legend.mastered]
  ] as const;

  // With fewer than three reviewed words the hand cannot show the memory
  // colours, so show the labelled sample instead. The real words stay one tap
  // away through "Ver las N" and the review round.
  const reviewedCount = hand.filter(word => !word.isNew).length;
  const isSample = hand.length > 0 && reviewedCount < MIN_REVIEWED_WORDS;
  const shownHand = isSample ? SAMPLE_HAND : hand;

  return (
    <section aria-labelledby="due-hand-title" className="due-hand">
      <SectionHeading
        action={
          totalDue > 0 ? (
            <Link href={href}>{copy.handViewAll(totalDue)}</Link>
          ) : undefined
        }
        pixel
        title={copy.handHeading}
      />
      <p className="due-hand__hint">{copy.handHint}</p>
      {isSample ? <p className="due-hand__sample">{copy.handSample}</p> : null}
      {shownHand.length > 0 ? (
        <ul className="due-hand__fan">
          {/* The artboard fans from the firmest word on the left to the most urgent on the right. */}
          {[...shownHand].reverse().map(word => (
            <li className="due-hand__item" key={word.id}>
              <DueWordCard href={href} sample={isSample} word={word} />
            </li>
          ))}
        </ul>
      ) : (
        <p className="due-hand__empty">{copy.handEmpty}</p>
      )}
      <ul aria-label={copy.legend.label} className="due-hand__legend">
        <li className="due-hand__legend-title">{copy.legend.label}</li>
        {legend.map(([key, label]) => (
          <li className="due-hand__legend-item" data-level={key} key={key}>
            <span aria-hidden="true" className="due-hand__legend-dot" />
            {label}
          </li>
        ))}
      </ul>
    </section>
  );
}
