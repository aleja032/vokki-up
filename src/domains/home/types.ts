import type {
  DueWord,
  HomeMission,
  UpcomingReviews,
  WorldProgress
} from '@/lib/home/home-hand.types';

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
    progressLabel: (completed: number, target: number) => string;
    completedToday: (target: number) => string;
    weeklyChartLabel: string;
    weeklyChartCaption: string;
    todayActivityHeading: string;
    heroKicker: (world: string) => string;
    legend: {
      label: string;
      fragile: string;
      learning: string;
      firm: string;
      mastered: string;
    };
    goalTotal: (target: number) => string;
    mission: {
      heading: string;
      imageAlt: (world: string) => string;
      description: (count: number) => string;
      cta: (term: string) => string;
      completeCta: string;
      bubble: (done: number, total: number, next: string | null) => string;
      noma: string;
    };
    journeyHeading: string;
    progressHeading: string;
    masteredCaption: string;
    seenCaption: (seen: number) => string;
    accuracyCaption: string;
    accuracyPeriod: string;
    progressNote: string;
    upcoming: {
      heading: string;
      link: string;
      today: string;
      todayHint: string;
      week: string;
      weekHint: string;
      safe: string;
      safeHint: string;
    };
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
  mission: HomeMission | null;
  upcoming: UpcomingReviews;
  worlds: WorldProgress[];
  activities: HomeActivity[];
};
