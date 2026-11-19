import Link from 'next/link';
import { SectionHeading } from '@/components/ui/section-heading';
import type { DueWord } from '@/lib/home/home-hand.types';
import { homeDashboardData } from '../data';
import { DueWordCard } from './due-word-card';
import './due-cards-hand.css';

const { copy } = homeDashboardData;

// Fan tilt in degrees for a hand of 1 to 4 cards, left to right.
const TILTS: Record<number, number[]> = {
  1: [0],
  2: [-2, 2],
  3: [-4, 0, 4],
  4: [-6, -2, 2, 6]
};

interface DueCardsHandProps {
  hand: DueWord[];
  totalDue: number;
  href: string;
}

export function DueCardsHand({ hand, totalDue, href }: DueCardsHandProps) {
  const tilts = TILTS[hand.length] ?? [];

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
      {hand.length > 0 ? (
        <ul className="due-hand__fan">
          {hand.map((word, index) => (
            <li
              className="due-hand__item"
              data-tilt={tilts[index]}
              key={word.id}
            >
              <DueWordCard href={href} word={word} />
            </li>
          ))}
        </ul>
      ) : (
        <p className="due-hand__empty">{copy.handEmpty}</p>
      )}
    </section>
  );
}
