import { describe, expect, it } from 'vitest';
import {
  getSelectableHubModes,
  resolveHubMode,
  parseAddHubMode
} from './add-hub-modes';

describe('hub modes with AI disabled', () => {
  it('only offers manual when AI is disabled', () => {
    expect(getSelectableHubModes(false)).toEqual(['manual']);
    expect(getSelectableHubModes(true)).toEqual(['image', 'words', 'manual']);
  });

  it('moves AI modes to manual when AI is disabled', () => {
    expect(resolveHubMode('image', false)).toBe('manual');
    expect(resolveHubMode('words', false)).toBe('manual');
    expect(resolveHubMode('manual', false)).toBe('manual');
    expect(resolveHubMode('image', true)).toBe('image');
  });
});

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
