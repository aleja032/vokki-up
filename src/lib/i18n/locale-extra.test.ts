import { afterEach, describe, expect, it } from 'vitest';
import { setAppLanguage, translateText } from './locale';

describe('audit leak translations', () => {
  afterEach(() => setAppLanguage('Español'));

  it('keeps Spanish untouched', () => {
    expect(translateText('Página 1 de 3')).toBe('Página 1 de 3');
  });

  it('translates interpolated text assembled outside messages', () => {
    setAppLanguage('English');
    expect(translateText('Página 1 de 3')).toBe('Page 1 of 3');
    expect(translateText('Repasar 4 tarjetas')).toBe('Review 4 cards');
    expect(translateText('Todo al día')).toBe('All caught up');
    expect(translateText('3 pendientes · disponible offline')).toBe(
      '3 pending · available offline'
    );
  });

  it('translates the review CTA labels with their noun', () => {
    setAppLanguage('English');
    expect(translateText('Repasar 1 tarjeta')).toBe('Review 1 card');
    expect(translateText('Repasar 10 tarjetas')).toBe('Review 10 cards');
    expect(translateText('Repasar tarjetas')).toBe('Review cards');
    expect(translateText('Repasar 3 tarjetas · Work')).toBe(
      'Review 3 cards · Work'
    );
    expect(translateText('Repasar 1 tarjeta · Work')).toBe(
      'Review 1 card · Work'
    );
  });

  it('translates the worlds labels', () => {
    setAppLanguage('English');
    expect(translateText('Mundos')).toBe('Worlds');
    expect(translateText('4 mundos')).toBe('4 worlds');
    expect(translateText('46 en tu mazo')).toBe('46 in your deck');
    expect(translateText('Nivel 2 de 3')).toBe('Level 2 of 3');
    expect(translateText('Etapa 1')).toBe('Stage 1');
    expect(translateText('46 de 800')).toBe('46 of 800');
    expect(translateText('Sin agregar')).toBe('Not added');
    expect(translateText('Oficina, reuniones y correos')).toBe(
      'Office, meetings and emails'
    );
  });

  it('translates the Mundos tabs and microcopy', () => {
    setAppLanguage('English');
    expect(translateText('Por mundos')).toBe('By world');
    expect(translateText('Toda la biblioteca')).toBe('Whole library');
    expect(translateText('Continuar Día a día')).toBe('Continue Día a día');
    expect(translateText('Continuar Daily life')).toBe('Continue Daily life');
    expect(translateText('12 de 80 en tu mazo')).toBe('12 of 80 in your deck');
    expect(translateText('en todos los mundos')).toBe('across all worlds');
  });

  it('translates the Mi mazo phone labels', () => {
    setAppLanguage('English');
    expect(translateText('12 para hoy')).toBe('12 for today');
    expect(translateText('Ver las 12')).toBe('View all 12');
    expect(translateText('Ver menos')).toBe('Show less');
    expect(translateText('Ver 10 más')).toBe('Show 10 more');
    expect(translateText('8 hoy')).toBe('8 today');
    expect(translateText('4 de 29 tarjetas')).toBe('4 of 29 cards');
    expect(translateText('1 de 1 tarjeta')).toBe('1 of 1 cards');
    expect(translateText('Con IA o manual')).toBe('With AI or manually');
  });
  it('translates the folder header, edit dialog and color names', () => {
    setAppLanguage('English');
    expect(translateText('17 tarjetas · 4 para hoy · 25% dominadas')).toBe(
      '17 cards · 4 due today · 25% mastered'
    );
    expect(translateText('Editar carpeta')).toBe('Edit folder');
    expect(translateText('Agregar tarjeta a esta carpeta')).toBe(
      'Add a card to this folder'
    );
    expect(translateText('Volver a todas las carpetas')).toBe(
      'Back to all folders'
    );
    expect(translateText('Lavanda')).toBe('Lavender');
    expect(translateText('Azul')).toBe('Blue');
  });
  it('translates the settings provider labels', () => {
    setAppLanguage('English');
    expect(translateText('Proveedor')).toBe('Provider');
    expect(translateText('Modelo')).toBe('Model');
    expect(translateText('Modelos GPT')).toBe('GPT models');
    expect(translateText('Vida diaria')).toBe('Daily life');
    expect(translateText('Laboral')).toBe('Work');
    expect(translateText('Ahora')).toBe('Just now');
  });

  it('translates the Mi mazo folder hint', () => {
    setAppLanguage('English');
    expect(translateText('Explorar Mundos')).toBe('Explore Worlds');
    expect(
      translateText(
        'Tus grupos para ordenar las tarjetas. Las palabras nuevas salen de los Mundos, por tema.'
      )
    ).toBe(
      'Your groups to organize cards. New words come from Worlds, by theme.'
    );
  });
});
