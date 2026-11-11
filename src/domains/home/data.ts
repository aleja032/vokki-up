import { createLocalizedMessages } from '@/lib/i18n/locale';
import type { HomeDashboardData } from './types';

export const homeDashboardData = createLocalizedMessages<HomeDashboardData>({
  copy: {
    greeting: '¡Hola de nuevo!',
    greetingDark: 'Buenas noches',
    greetingSupport: 'Cinco minutos hoy mantienen tu racha.',
    greetingSupportDark: 'Un repaso corto antes de dormir fija mejor.',
    greetingSupportWide: streakDays =>
      `Cinco minutos hoy mantienen tu racha de ${streakDays} días.`,
    newCard: 'Nueva tarjeta',
    nextSessionDescription:
      'Funciona sin conexión. Tu progreso se sincroniza después.',
    pendingChip: count => `${count} por repasar`,
    newChip: count => `${count} nuevas`,
    minutesChip: minutes => `~${minutes} min`,
    goalRemaining: remaining => `${remaining} más y cumples la meta`,
    completedCards: target => `de ${target} tarjetas`,
    weekdayInitial: day => day.charAt(0),
    nextSessionHeading: 'Tu próxima sesión',
    goalHeading: 'Meta de hoy',
    nextSessionSummary: (pendingCount, newCount, minutes) =>
      `${pendingCount} por repasar · ${newCount} nuevas · ~${minutes} min`,
    startSession: 'Empezar ahora',
    weekHeading: 'Tu semana',
    statisticsLink: 'Ver estadísticas',
    progressLabel: (completed, target) =>
      `${completed} de ${target} tarjetas completadas hoy`,
    completedToday: target => `de ${target} hoy`,
    weeklyChartLabel: 'Tarjetas repasadas esta semana',
    weeklyChartCaption: 'Tarjetas repasadas por día',
    streakMetricLabel: 'días seguidos',
    seenMetricLabel: 'palabras vistas',
    masteredMetricLabel: 'dominadas',
    statisticsLabels: {
      streakDays: 'Racha actual',
      wordsSeen: 'Palabras vistas',
      masteredWords: 'Palabras dominadas',
      weeklyMinutes: 'Estudiados esta semana'
    },
    statisticsSectionLabel: 'Tu progreso',
    statisticsUnits: {
      streakDays: 'días',
      weeklyMinutes: 'min'
    },
    todayActivityHeading: 'Actividad de hoy'
  },
  nextSession: {
    title: 'Repasar 10 tarjetas',
    pendingCount: 7,
    newCount: 3,
    estimatedMinutes: 5,
    href: '/review'
  },
  progress: {
    completed: 12,
    target: 20,
    ringDashArray: '128 214',
    weeklyActivity: [
      { day: 'Lun', count: 14, level: 2, isToday: false },
      { day: 'Mar', count: 18, level: 3, isToday: false },
      { day: 'Mié', count: 9, level: 1, isToday: false },
      { day: 'Jue', count: 12, level: 3, isToday: true },
      { day: 'Vie', count: 0, level: 0, isToday: false },
      { day: 'Sáb', count: 0, level: 0, isToday: false },
      { day: 'Dom', count: 0, level: 0, isToday: false }
    ]
  },
  stats: {
    streakDays: 12,
    wordsSeen: 48,
    masteredWords: 12,
    weeklyMinutes: 64
  },
  activities: [
    {
      title: 'Repasar tarjetas',
      description: '10 pendientes · disponible offline',
      href: '/review',
      icon: 'cards'
    },
    {
      title: 'Practicar escritura',
      description: '1 reto de conversación',
      href: '/writing',
      icon: 'writing'
    },
    {
      title: 'Revisar notas',
      description: '2 favoritas sin leer',
      href: '/notes',
      icon: 'notes'
    }
  ]
});
