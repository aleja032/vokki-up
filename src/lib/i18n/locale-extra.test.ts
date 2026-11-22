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
  it('translates the settings provider labels', () => {
    setAppLanguage('English');
    expect(translateText('Proveedor')).toBe('Provider');
    expect(translateText('Modelo')).toBe('Model');
    expect(translateText('Modelos GPT')).toBe('GPT models');
    expect(translateText('Vida diaria')).toBe('Daily life');
    expect(translateText('Laboral')).toBe('Work');
    expect(translateText('Ahora')).toBe('Just now');
  });
});
