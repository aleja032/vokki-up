import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import type { HomeSummary } from '../home-summary.types';
import { HomeDashboard } from './home-dashboard';

const summary: HomeSummary = {
  totalDue: 3,
  newCount: 2,
  pendingCount: 3,
  completed: 1,
  streakDays: 2,
  wordsSeen: 10,
  masteredWords: 4,
  weeklyMinutes: 12,
  weeklyActivity: [],
  dueHand: [],
  mission: {
    steps: [
      { term: 'coffee', state: 'done' },
      { term: 'menu', state: 'current' }
    ],
    doneCount: 1,
    nextTerm: 'menu'
  },
  upcoming: { today: 3, week: 2, safe: 5 },
  weeklyAccuracy: null,
  worlds: [{ id: 'daily', name: 'Día a día', learned: 4, total: 200 }]
};

describe('HomeDashboard intro action', () => {
  const html = renderToStaticMarkup(createElement(HomeDashboard, { summary }));

  it('does not offer a new card button', () => {
    expect(html).not.toContain('Nueva tarjeta');
  });

  it('links to the word library with one clear action', () => {
    expect(html.split('href="/cards/word-library"').length - 1).toBe(1);
    expect(html).toContain('Agregar desde la biblioteca');
  });

  it('shows the mission, the word path, the progress and the upcoming reviews', () => {
    expect(html).toContain('Misión de hoy');
    expect(html).toContain('Recordar menu');
    expect(html).toContain('Tu recorrido de palabras');
    expect(html).toContain('Tu progreso de vocabulario');
    expect(html).toContain('Próximos repasos');
    expect(html).toContain('Mundo · Día a día');
  });
});
