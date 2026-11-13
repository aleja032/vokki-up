import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  readBrowserValue,
  readBrowserValueResult,
  STORAGE_PREFIX,
  STORAGE_VERSION
} from './browser-storage';

describe('readBrowserValueResult', () => {
  const key = 'cards/library';
  const storageKey = `${STORAGE_PREFIX}:${key}`;
  const localStorageMock = {
    getItem: vi.fn<(key: string) => string | null>(() => null)
  };

  beforeEach(() => {
    localStorageMock.getItem = vi.fn(() => null);
    vi.stubGlobal('window', { localStorage: localStorageMock });
  });

  it('distinguishes a missing value from invalid stored data', () => {
    expect(readBrowserValueResult(key)).toEqual({ status: 'missing' });

    localStorageMock.getItem = vi.fn(() => '{broken');
    expect(readBrowserValueResult(key)).toEqual({ status: 'invalid' });
  });

  it('preserves valid saved values and rejects unsupported versions', () => {
    const saved = [{ id: 'saved' }];
    localStorageMock.getItem = vi.fn(() =>
      JSON.stringify({ version: STORAGE_VERSION, value: saved })
    );
    expect(readBrowserValueResult(key)).toEqual({
      status: 'valid',
      value: saved
    });
    expect(readBrowserValue(key)).toEqual(saved);

    localStorageMock.getItem = vi.fn(() =>
      JSON.stringify({ version: STORAGE_VERSION + 1, value: ['future'] })
    );
    expect(readBrowserValueResult(key)).toEqual({ status: 'invalid' });
    expect(readBrowserValue(key)).toBeUndefined();
    expect(localStorageMock.getItem).toHaveBeenCalledWith(storageKey);
  });

  it('reports unavailable storage without treating it as missing', () => {
    localStorageMock.getItem = vi.fn(() => {
      throw new Error('blocked');
    });
    expect(readBrowserValueResult(key)).toEqual({ status: 'unavailable' });
  });
});
