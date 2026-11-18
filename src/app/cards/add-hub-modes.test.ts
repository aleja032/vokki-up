import { describe, expect, it } from 'vitest';
import {
  ADD_HUB_MODES,
  getSelectableHubModes,
  isHubModeLocked,
  resolveHubMode,
  parseAddHubMode
} from './add-hub-modes';

describe('hub modes with AI disabled', () => {
  it('always lists the three modes', () => {
    expect([...ADD_HUB_MODES]).toEqual(['image', 'words', 'manual']);
  });

  it('only allows selecting manual when AI is disabled', () => {
    expect(getSelectableHubModes(false)).toEqual(['manual']);
    expect(getSelectableHubModes(true)).toEqual(['image', 'words', 'manual']);
  });

  it('locks only the AI modes when AI is disabled', () => {
    expect(isHubModeLocked('image', false)).toBe(true);
    expect(isHubModeLocked('words', false)).toBe(true);
    expect(isHubModeLocked('manual', false)).toBe(false);
    expect(isHubModeLocked('image', true)).toBe(false);
    expect(isHubModeLocked('words', true)).toBe(false);
  });

  it('moves a locked AI mode to manual', () => {
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
