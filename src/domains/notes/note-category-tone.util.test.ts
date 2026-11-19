import { describe, expect, it } from 'vitest';
import {
  getNoteCategoryTone,
  getNoteSectionTone
} from './note-category-tone.util';

describe('getNoteCategoryTone', () => {
  it('gives every built-in category its own accent', () => {
    expect(getNoteCategoryTone('General')).toBe('neutral');
    expect(getNoteCategoryTone('Expresiones')).toBe('mint');
    expect(getNoteCategoryTone('Gramática')).toBe('brand');
    expect(getNoteCategoryTone('Cultura')).toBe('amber');
    expect(getNoteCategoryTone('Ideas')).toBe('coral');
  });

  it('falls back to the brand tone for custom categories', () => {
    expect(getNoteCategoryTone('Viajes')).toBe('brand');
  });
});

describe('getNoteSectionTone', () => {
  it('alternates between mint and coral', () => {
    expect(getNoteSectionTone(0)).toBe('mint');
    expect(getNoteSectionTone(1)).toBe('coral');
    expect(getNoteSectionTone(2)).toBe('mint');
  });
});
