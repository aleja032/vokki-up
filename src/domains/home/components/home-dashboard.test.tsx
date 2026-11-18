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
  weeklyActivity: []
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
});
