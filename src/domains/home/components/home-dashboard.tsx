import { deriveHomeDashboardData } from '../derive-home-dashboard-data';
import type { HomeSummary } from '../home-summary.types';
import { DueCardsHand } from './due-cards-hand';
import { GoalChestCard } from './goal-chest-card';
import { HeroPanel } from './hero-panel';
import { HomeIntro } from './home-intro';
import { StatisticsStrip } from './statistics-strip';
import { TodayActivityCard } from './today-activity-card';
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
  const { nextSession, activities, stats, progress, dueHand } = data;

  return (
    <div className="home-dashboard">
      <HomeIntro streakDays={stats.streakDays} />
      <HeroPanel data={nextSession} />
      <div className="home-dashboard__hand-row">
        <DueCardsHand
          hand={dueHand}
          href={nextSession.href}
          totalDue={nextSession.pendingCount + nextSession.newCount}
        />
        <GoalChestCard progress={progress} />
      </div>
      <StatisticsStrip stats={stats} />
      <div className="home-dashboard__lower">
        <WeekLeafChart days={progress.weeklyActivity} />
        <TodayActivityCard activities={activities} />
      </div>
      <WorldsRow worlds={data.worlds} />
    </div>
  );
}
