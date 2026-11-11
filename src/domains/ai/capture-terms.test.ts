import { describe, expect, it } from 'vitest';
import { countCaptureTerms, MAX_CAPTURE_TERMS } from './capture-terms';

describe('countCaptureTerms', () => {
  it('counts terms split by commas, semicolons and new lines', () => {
    expect(countCaptureTerms('take off, reliable;\nopportunity')).toBe(3);
  });

  it('ignores blanks and repeated separators', () => {
    expect(countCaptureTerms(' , ,\n\n; ')).toBe(0);
    expect(countCaptureTerms('')).toBe(0);
  });

  it('exposes the same limit the server enforces', () => {
    expect(MAX_CAPTURE_TERMS).toBe(20);
  });
});
