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
    ['Subieron de memoria', 'Memory went up']
  ])('translates %s', (spanish, english) => {
    expect(extraTranslations[spanish]).toBe(english);
  });

  it.each([
    ['4 de 4 aciertos', '4 of 4 correct'],
    ['1 de 1 acierto', '1 of 1 correct'],
    ['¡Combo x3! Vas sin fallar.', 'Combo x3! No misses so far.'],
    ['¡Rescataste 1 palabra!', 'You rescued 1 word!'],
    ['¡Rescataste 12 palabras!', 'You rescued 12 words!']
  ])('translates the interpolated %s', (spanish, english) => {
    expect(dynamic(spanish)).toBe(english);
  });
});
