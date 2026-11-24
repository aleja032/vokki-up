import { afterEach, describe, expect, it } from 'vitest';
import { setAppLanguage, translateText } from '@/lib/i18n/locale';
import { homeDashboardData } from './data';

// translateText falls back to substring replacement, so a capitalized variant
// without its own entry used to come out half translated ("Words vistas").
// The generic marker list in inline-messages-coverage.test.ts misses those, so
// the home strings get an explicit list of Spanish words here.
const SPANISH_WORDS =
  /[ñáéíóúÁÉÍÓÚ¿¡]|\b(racha|actual|vistas?|palabras?|d[ií]as?|dominadas?|tarjetas?|repasar|repasadas?|hoy|semana|progreso|estudiados?|pr[oó]xima|empezar|ahora|estad[ií]sticas|actividad|nuevas?|disponible|favoritas?|leer|sin|desde|biblioteca|agregar|todo|tu|esta|por|más|cumples|seguidos|pendientes?|sesi[oó]n|lun|mar|mi[eé]|jue|vie|s[aá]b|dom)\b/i;

function collectHomeStrings(): string[] {
  const { copy, nextSession, activities } = homeDashboardData;
  const strings: string[] = [
    copy.addFromLibrary,
    copy.nextSessionDescription,
    copy.pendingChip(7),
    copy.goalRemaining(8),
    copy.completedCards(20),
    copy.nextSessionHeading,
    copy.goalHeading,
    copy.nextSessionSummary(7, 3, 5),
    copy.startSession,
    copy.weekHeading,
    copy.progressLabel(12, 20),
    copy.completedToday(20),
    copy.weeklyChartLabel,
    copy.weeklyChartCaption,
    copy.todayActivityHeading,
    copy.heroKicker('Daily life'),
    ...Object.values(copy.legend),
    copy.goalTotal(20),
    copy.mission.heading,
    copy.mission.imageAlt('Daily life'),
    copy.mission.description(1),
    copy.mission.description(5),
    copy.mission.cta('receipt'),
    copy.mission.completeCta,
    copy.mission.bubble(3, 5, 'receipt'),
    copy.mission.bubble(4, 5, 'receipt'),
    copy.mission.bubble(0, 5, 'receipt'),
    copy.mission.bubble(5, 5, null),
    copy.mission.noma,
    copy.journeyHeading,
    copy.progressHeading,
    copy.masteredCaption,
    copy.seenCaption(214),
    copy.accuracyCaption,
    copy.accuracyPeriod,
    copy.progressNote,
    ...Object.values(copy.upcoming),
    copy.heroTitleLead(12),
    copy.heroTitleLead(1),
    copy.heroTitleAccent,
    copy.heroTitleTail,
    copy.heroBubble,
    copy.heroMascotAlt,
    copy.handHeading,
    copy.handHint,
    copy.handViewAll(12),
    copy.handEmpty,
    copy.handSample,
    copy.dueNewLabel,
    copy.dueForgettingLabel,
    copy.dueTodayLabel,
    copy.memoryLabel(3),
    copy.goalCount(8, 20),
    copy.goalDone,
    copy.startRound,
    copy.worldsHeading,
    copy.worldActive,
    copy.worldNew,
    nextSession.title,
    ...activities.flatMap(activity => [activity.title, activity.description]),
    // Built in derive-home-dashboard-data.ts from live counts.
    '12 pendientes · disponible offline',
    'Repasar 12 tarjetas',
    'Todo al día'
  ];
  return strings;
}

describe('home dashboard in English', () => {
  afterEach(() => setAppLanguage('Español'));

  it('collects the home strings', () => {
    expect(collectHomeStrings().length).toBeGreaterThan(30);
  });

  it('leaves no Spanish word in any home string', () => {
    setAppLanguage('English');
    const leaks = collectHomeStrings()
      .map(text => [text, translateText(text)])
      .filter(([, translated]) => SPANISH_WORDS.test(translated))
      .map(([text, translated]) => `${text} -> ${translated}`);
    expect(leaks).toEqual([]);
  });

  it.each([
    ['Racha actual', 'Current streak'],
    ['Palabras vistas', 'Words seen'],
    ['palabras vistas', 'words seen'],
    ['Palabras dominadas', 'Mastered words'],
    ['Estudiados esta semana', 'Studied this week']
  ])('translates %s exactly', (spanish, english) => {
    setAppLanguage('English');
    expect(translateText(spanish)).toBe(english);
  });

  it('keeps the Spanish source when Spanish is selected', () => {
    setAppLanguage('Español');
    expect(translateText('Racha actual')).toBe('Racha actual');
  });
});
