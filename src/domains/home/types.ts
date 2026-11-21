import type { DueWord, WorldProgress } from '@/lib/home/home-hand.types';

export type HomeActivity = {
  title: string;
  description: string;
  href: string;
  icon: 'cards' | 'writing' | 'notes';
};

export type WeeklyActivity = {
  day: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
  isToday: boolean;
};

export type HomeDashboardData = {
  copy: {
    addFromLibrary: string;
    nextSessionDescription: string;
    pendingChip: (count: number) => string;
    newChip: (count: number) => string;
    minutesChip: (minutes: number) => string;
    goalRemaining: (remaining: number) => string;
    completedCards: (target: number) => string;
    weekdayInitial: (day: string) => string;
    nextSessionHeading: string;
    goalHeading: string;
    nextSessionSummary: (
      pendingCount: number,
      newCount: number,
      minutes: number
    ) => string;
    startSession: string;
    weekHeading: string;
    statisticsLink: string;
    progressLabel: (completed: number, target: number) => string;
    completedToday: (target: number) => string;
    weeklyChartLabel: string;
    weeklyChartCaption: string;
    streakMetricLabel: string;
    seenMetricLabel: string;
    masteredMetricLabel: string;
    statisticsLabels: {
      streakDays: string;
      wordsSeen: string;
      masteredWords: string;
      weeklyMinutes: string;
      accuracy: string;
    };
    statisticsSectionLabel: string;
    statisticsUnits: {
      streakDays: string;
      weeklyMinutes: string;
    };
    todayActivityHeading: string;
    heroTitleLead: (count: number) => string;
    heroTitleAccent: string;
    heroTitleTail: string;
    heroBubble: string;
    heroMascotAlt: string;
    handHeading: string;
    handHint: string;
    handViewAll: (count: number) => string;
    handEmpty: string;
    dueNewLabel: string;
    dueForgettingLabel: string;
    dueTodayLabel: string;
    memoryLabel: (level: number) => string;
    goalCount: (completed: number, target: number) => string;
    goalDone: string;
    startRound: string;
    worldsHeading: string;
    worldActive: string;
    worldNew: string;
  };
  nextSession: {
    title: string;
    pendingCount: number;
    newCount: number;
    estimatedMinutes: number;
    href: string;
  };
  progress: {
    completed: number;
    target: number;
    ringDashArray: string;
    weeklyActivity: WeeklyActivity[];
  };
  stats: {
    streakDays: number | null;
    wordsSeen: number | null;
    masteredWords: number;
    weeklyMinutes: number;
    accuracy: number | null;
  };
  dueHand: DueWord[];
  worlds: WorldProgress[];
  activities: HomeActivity[];
};
