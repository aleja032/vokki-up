import { afterEach, describe, expect, it } from 'vitest';
import { setAppLanguage } from '@/lib/i18n/locale';
import { getSampleGroupLabel } from './data';

describe('getSampleGroupLabel', () => {
  afterEach(() => setAppLanguage('Español'));

  it('keeps the Spanish seed group names for Spanish', () => {
    expect(getSampleGroupLabel('Frases útiles')).toBe('Frases útiles');
  });

  it('shows the seed group names in English', () => {
    setAppLanguage('English');
    expect(getSampleGroupLabel('Trabajo')).toBe('Work');
    expect(getSampleGroupLabel('Frases útiles')).toBe('Useful phrases');
  });

  it('leaves unknown group names as typed', () => {
    setAppLanguage('English');
    expect(getSampleGroupLabel('Trabajo final')).toBe('Trabajo final');
  });
});
