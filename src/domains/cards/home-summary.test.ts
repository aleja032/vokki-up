import { describe, expect, it } from 'vitest';
import { formatShortWeekday } from './home-summary';

describe('formatShortWeekday', () => {
  const monday = new Date(2026, 0, 5);

  it('uses Spanish weekday names for the es locale', () => {
    expect(formatShortWeekday(monday, 'es')).toBe('Lun');
  });

  it('uses English weekday names for the en locale', () => {
    expect(formatShortWeekday(monday, 'en')).toBe('Mon');
  });
});
