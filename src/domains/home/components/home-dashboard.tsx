import { homeDashboardData } from '../data';
import { deriveHomeDashboardData } from '../derive-home-dashboard-data';
import type { HomeSummary } from '../home-summary.types';
import { DueCardsHand } from './due-cards-hand';
import { GoalChestCard } from './goal-chest-card';
import { HeroPanel } from './hero-panel';
import { JourneyCard } from './journey-card';
import { MissionCard } from './mission-card';
import { UpcomingReviewsCard } from './upcoming-reviews-card';
import { VocabularyProgressCard } from './vocabulary-progress-card';
import { WeekLeafChart } from './week-leaf-chart';
import { WorldsRow } from './worlds-row';
import './home-dashboard.css';

interface HomeDashboardProps {
  summary: HomeSummary | null;
}

export function HomeDashboard({ summary }: HomeDashboardProps) {
  if (!summary) {
    return (
      <div className="home-dashboard" aria-busy="true">
        <p role="status">Cargando tu progreso…</p>
      </div>
    );
  }

  const data = deriveHomeDashboardData(summary);
  const { nextSession, activities, stats, progress, dueHand, mission } = data;
  // The world the user is working on: the first one with words in the deck.
  const activeWorld =
    data.worlds.find(world => world.learned > 0) ?? data.worlds[0];

  return (
    <div className="home-dashboard">
      <HeroPanel
        data={nextSession}
        words={dueHand.map(word => word.term)}
        worldName={activeWorld?.name}
      />
      <div className="home-dashboard__hand-row">
        <DueCardsHand
          hand={dueHand}
          href={nextSession.href}
          totalDue={nextSession.pendingCount + nextSession.newCount}
        />
        <GoalChestCard progress={progress} />
      </div>
      <section
        aria-label={homeDashboardData.copy.progressHeading}
        className="home-dashboard__advance"
      >
        {mission && activeWorld ? (
          <>
            <MissionCard
              href={nextSession.href}
              mission={mission}
              worldName={activeWorld.name}
            />
            <JourneyCard mission={mission} />
          </>
        ) : null}
        <VocabularyProgressCard stats={stats} />
      </section>
      <div className="home-dashboard__lower">
        <WeekLeafChart days={progress.weeklyActivity} />
        <UpcomingReviewsCard
          activities={activities.filter(activity => activity.icon !== 'cards')}
          reviewHref={nextSession.href}
          upcoming={data.upcoming}
        />
      </div>
      <WorldsRow worlds={data.worlds} />
    </div>
  );
}
