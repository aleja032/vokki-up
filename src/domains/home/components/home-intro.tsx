import Link from 'next/link';
import { Library } from 'lucide-react';
import { StreakPill } from '@/components/ui/streak-pill';
import { homeDashboardData } from '../data';
import './home-intro.css';

const { copy } = homeDashboardData;

export function HomeIntro({ streakDays }: { streakDays: number | null }) {
  return (
    <header className="home-intro">
      <p className="home-intro__copy">
        <strong className="home-intro__greeting">{copy.greeting}</strong>
        <span className="home-intro__support--light">
          {copy.greetingSupport}
        </span>
        {streakDays ? (
          <span className="home-intro__support--wide">
            {copy.greetingSupportWide(streakDays)}
          </span>
        ) : null}
      </p>
      <div className="home-intro__actions">
        {streakDays ? <StreakPill days={streakDays} /> : null}
        <Link className="home-intro__action" href="/cards/word-library">
          <Library aria-hidden="true" size={18} strokeWidth={1.8} />
          {copy.addFromLibrary}
        </Link>
      </div>
    </header>
  );
}
