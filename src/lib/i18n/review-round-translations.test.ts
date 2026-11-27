import { describe, expect, it } from 'vitest';
import {
  extraDynamicTranslations,
  extraTranslations
} from './locale-extra-translations';

function dynamic(value: string): string | undefined {
  const entry = extraDynamicTranslations.find(([pattern]) =>
    pattern.test(value)
  );
  return entry ? value.replace(entry[0], entry[1]) : undefined;
}

describe('review round English entries', () => {
  it.each([
    ['Palabra nueva', 'New word'],
    ['Memoria baja', 'Low memory'],
    ['Memoria media', 'Medium memory'],
    ['Memoria alta', 'High memory'],
    ['Ronda completada', 'Round complete'],
    ['Aciertos', 'Correct'],
    ['Mejor combo', 'Best combo'],
    ['Racha', 'Streak'],
    ['Subieron de memoria', 'Memory went up'],
    ['Ronda de:', 'Round of:'],
    ['Tamaño de la ronda', 'Round size'],
    ['Estudiar por adelantado', 'Study ahead'],
    ['Te queda 1 por repasar hoy', 'You have 1 left to review today'],
    [
      'Estás adelantando tarjetas que aún no tocan.',
      'You are studying cards that are not due yet.'
    ]
  ])('translates %s', (spanish, english) => {
    expect(extraTranslations[spanish]).toBe(english);
  });

  it.each([
    ['4 de 4 aciertos', '4 of 4 correct'],
    ['1 de 1 acierto', '1 of 1 correct'],
    ['¡Combo x3! Vas sin fallar.', 'Combo x3! No misses so far.'],
    ['¡Rescataste 1 palabra!', 'You rescued 1 word!'],
    ['¡Rescataste 12 palabras!', 'You rescued 12 words!'],
    ['Repasar 10 más', 'Review 10 more'],
    ['Te quedan 14 por repasar hoy', 'You have 14 left to review today']
  ])('translates the interpolated %s', (spanish, english) => {
    expect(dynamic(spanish)).toBe(english);
  });
});
