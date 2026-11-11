import Link from 'next/link';
import { Plus } from 'lucide-react';
import { homeDashboardData } from '../data';
import { deriveHomeDashboardData } from '../derive-home-dashboard-data';
import type { HomeSummary } from '../home-summary.types';
import { NextSessionCard } from './next-session-card';
import { StatisticsStrip } from './statistics-strip';
import { TodayActivityCard } from './today-activity-card';
import { TodayGoalCard } from './today-goal-card';
import { WeekOverviewCard } from './week-overview-card';
import { WeeklyProgressCard } from './weekly-progress-card';
import './home-dashboard.css';

interface HomeDashboardProps {
  summary: HomeSummary | null;
}

const { copy } = homeDashboardData;

export function HomeDashboard({ summary }: HomeDashboardProps) {
  const data = summary ? deriveHomeDashboardData(summary) : homeDashboardData;
  const { nextSession, activities, stats } = data;
  const streakDays = stats.streakDays;

  return (
    <div className="home-dashboard">
      <header className="home-intro">
        <div className="home-intro__copy">
          <h1>
            <span className="home-intro__greeting--light">{copy.greeting}</span>
            <span className="home-intro__greeting--dark">
              {copy.greetingDark}
            </span>
          </h1>
          <p>
            <span className="home-intro__support--light">
              {copy.greetingSupport}
            </span>
            {streakDays ? (
              <span className="home-intro__support--wide">
                {copy.greetingSupportWide(streakDays)}
              </span>
            ) : null}
            <span className="home-intro__support--dark">
              {copy.greetingSupportDark}
            </span>
          </p>
        </div>
        <Link className="home-intro__action" href="/cards">
          <Plus aria-hidden="true" size={18} strokeWidth={1.8} />
          {copy.newCard}
        </Link>
      </header>
      <div className="home-dashboard__featured">
        <NextSessionCard data={nextSession} />
        <TodayGoalCard progress={data.progress} />
      </div>
      <StatisticsStrip stats={stats} />
      <WeekOverviewCard data={data} />
      <div className="home-dashboard__lower">
        <TodayActivityCard activities={activities} />
        <WeeklyProgressCard data={data} />
      </div>
    </div>
  );
}
