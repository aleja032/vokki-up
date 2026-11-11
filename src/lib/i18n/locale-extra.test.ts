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
});
