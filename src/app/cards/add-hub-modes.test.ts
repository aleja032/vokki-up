import { describe, expect, it } from 'vitest';
import { parseAddHubMode } from './add-hub-modes';

describe('parseAddHubMode', () => {
  it('accepts the three modes', () => {
    expect(parseAddHubMode('image')).toBe('image');
    expect(parseAddHubMode('words')).toBe('words');
    expect(parseAddHubMode('manual')).toBe('manual');
  });

  it('falls back to manual for anything else', () => {
    expect(parseAddHubMode(undefined)).toBe('manual');
    expect(parseAddHubMode('ai')).toBe('manual');
    expect(parseAddHubMode(['image'])).toBe('manual');
  });
});
