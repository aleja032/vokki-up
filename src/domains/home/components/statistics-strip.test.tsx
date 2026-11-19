import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { StatisticsStrip } from './statistics-strip';

const stats = {
  streakDays: 12,
  wordsSeen: 214,
  masteredWords: 96,
  weeklyMinutes: 64,
  accuracy: 86
};

describe('StatisticsStrip', () => {
  it('renders every statistic with its label and value', () => {
    const html = renderToStaticMarkup(<StatisticsStrip stats={stats} />);

    expect(html).toContain('Palabras vistas');
    expect(html).toContain('Palabras dominadas');
    expect(html).toContain('Racha actual');
    expect(html).toContain('Estudiados esta semana');
    expect(html).toContain('Aciertos esta semana');
    expect(html).toContain('86%');
    expect(html).toContain('12 días');
  });

  it('omits accuracy when there is nothing to measure', () => {
    const html = renderToStaticMarkup(
      <StatisticsStrip stats={{ ...stats, accuracy: null }} />
    );

    expect(html).not.toContain('Aciertos esta semana');
  });

  it('announces missing data instead of a number', () => {
    const html = renderToStaticMarkup(
      <StatisticsStrip stats={{ ...stats, wordsSeen: null }} />
    );

    expect(html).toContain('Dato no disponible');
  });
});
