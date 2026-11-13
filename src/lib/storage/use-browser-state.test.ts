import { describe, expect, it } from 'vitest';
import type { BrowserValueReadResult } from './browser-storage';
import { canPersistBrowserState } from './use-browser-state';

const isStringList = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every(item => typeof item === 'string');

describe('canPersistBrowserState', () => {
  it('uses and preserves valid saved state', () => {
    const saved = ['saved'];
    expect(
      canPersistBrowserState({ status: 'valid', value: saved }, isStringList)
    ).toBe(true);
  });

  it('allows a missing key to initialize from its fallback', () => {
    expect(canPersistBrowserState({ status: 'missing' }, isStringList)).toBe(
      true
    );
  });

  it.each<BrowserValueReadResult>([
    { status: 'invalid' },
    { status: 'unavailable' },
    { status: 'valid', value: { unexpected: true } }
  ])('does not authorize writing fallback for %#', result => {
    expect(canPersistBrowserState(result, isStringList)).toBe(false);
  });
});
