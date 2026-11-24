import { createLocalizedMessages } from '@/lib/i18n/locale';
import type { HomeDashboardData } from './types';

export const homeDashboardData = createLocalizedMessages<HomeDashboardData>({
  copy: {
    addFromLibrary: 'Agregar desde la biblioteca',
    nextSessionDescription:
      'Responde tus cartas antes de que se olviden y abre el cofre de la meta.',
    pendingChip: count => `${count} por repasar`,
    goalRemaining: remaining => `${remaining} tarjetas más y abres el cofre.`,
    completedCards: target => `de ${target} tarjetas`,
    weekdayInitial: day => day.charAt(0),
    nextSessionHeading: 'Tu próxima sesión',
    goalHeading: 'Meta de hoy',
    nextSessionSummary: (pendingCount, newCount, minutes) =>
      `${pendingCount} por repasar · ${newCount} nuevas · ~${minutes} min`,
    startSession: 'Empezar ahora',
    weekHeading: 'Tu semana',
    progressLabel: (completed, target) =>
      `${completed} de ${target} tarjetas completadas hoy`,
    completedToday: target => `de ${target} hoy`,
    weeklyChartLabel: 'Tarjetas repasadas esta semana',
    weeklyChartCaption: 'Tarjetas repasadas por día',
    todayActivityHeading: 'Actividad de hoy',
    heroKicker: world => `Mundo · ${world}`,
    legend: {
      label: 'Dominio',
      fragile: 'Frágil',
      learning: 'Aprendiendo',
      firm: 'Firme',
      mastered: 'Dominada'
    },
    goalTotal: target => `/ ${target} tarjetas`,
    mission: {
      heading: 'Misión de hoy',
      imageAlt: world => `Mundo ${world}`,
      description: count =>
        count === 1
          ? 'Noma detectó 1 palabra clave de este mundo. Recuérdala para que este lugar se vea más nítido.'
          : `Noma detectó ${count} palabras clave de este mundo. Recuérdalas para que este lugar se vea más nítido.`,
      cta: term => `Recordar ${term}`,
      completeCta: 'Seguir repasando',
      bubble: (done, total, next) => {
        if (!next) return `¡Misión cumplida! Recordaste las ${total} palabras.`;
        if (done === 0)
          return `Empieza con ${next}: cada palabra recordada avanza la misión.`;
        return done === total - 1
          ? `¡Genial! Ya recordaste ${done} de ${total} palabras. Con ${next} la misión quedará casi completa.`
          : `¡Genial! Ya recordaste ${done} de ${total} palabras. Sigue con ${next}.`;
      },
      noma: 'Noma celebrando'
    },
    journeyHeading: 'Tu recorrido de palabras',
    progressHeading: 'Tu progreso de vocabulario',
    masteredCaption: 'palabras dominadas',
    seenCaption: seen => `de ${seen} vistas`,
    accuracyCaption: 'de aciertos',
    accuracyPeriod: 'esta semana',
    progressNote:
      'Cada palabra dominada hace crecer a Noma y el mundo se ve más nítido.',
    upcoming: {
      heading: 'Próximos repasos',
      link: 'Mi mazo',
      today: 'Hoy',
      todayHint: 'Para repasar ya',
      week: 'Esta semana',
      weekHint: 'De mañana a 7 días',
      safe: 'Seguras',
      safeHint: '8 días o más'
    },
    heroTitleLead: count => (count === 1 ? 'palabra por' : 'palabras por'),
    heroTitleAccent: 'rescatar',
    heroTitleTail: 'hoy',
    heroBubble: 'Tu mano de hoy ya está lista.',
    heroMascotAlt: 'Noma, tu compañera de repaso',
    handHeading: 'Por repasar · tu mano de hoy',
    handHint: 'Mientras más baja la barra de memoria, más urgente.',
    handViewAll: count => `Ver las ${count}`,
    handEmpty: 'Tu mano de hoy está vacía.',
    handSample: 'Ejemplo · así se verá tu mano cuando repases',
    dueNewLabel: 'Nueva',
    dueForgettingLabel: 'Se olvida hoy',
    dueTodayLabel: 'Repasa hoy',
    memoryLabel: level => `Memoria ${level} de 5`,
    goalCount: (completed, target) => `${completed} / ${target} tarjetas`,
    goalDone: '¡Meta cumplida! Abriste el cofre.',
    startRound: 'Empezar ronda',
    worldsHeading: 'Mundos',
    worldActive: 'En curso',
    worldNew: 'Nuevo mundo'
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
    weeklyMinutes: 64,
    accuracy: null
  },
  dueHand: [],
  mission: null,
  upcoming: { today: 0, week: 0, safe: 0 },
  worlds: [],
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
