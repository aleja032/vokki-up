import { afterEach, describe, expect, it } from 'vitest';
import { createLocalizedMessages, setAppLanguage } from './locale';

describe('localized messages', () => {
  afterEach(() => setAppLanguage('Español'));

  it('keeps Spanish as the default locale', () => {
    const messages = createLocalizedMessages({ title: 'Tarjetas' });

    expect(messages.title).toBe('Tarjetas');
  });

  it('translates nested values, arrays, and interpolated functions', () => {
    const messages = createLocalizedMessages({
      title: 'Nueva tarjeta',
      labels: ['Guardar', 'Cancelar'],
      summary: (count: number) => `${count} tarjetas creadas`
    });

    setAppLanguage('English');

    expect(messages.title).toBe('New card');
    expect([...messages.labels]).toEqual(['Save', 'Cancel']);
    expect(messages.summary(2)).toBe('2 cards created');
  });

  it('translates common dynamic card and home summaries', () => {
    const messages = createLocalizedMessages({
      due: (count: number) => `${count} por repasar`,
      streak: (days: number) =>
        `Cinco minutos hoy mantienen tu racha de ${days} días.`
    });

    setAppLanguage('English');

    expect(messages.due(3)).toBe('3 to review');
    expect(messages.streak(4)).toBe(
      'Five minutes today keep your 4-day streak.'
    );
  });
});
