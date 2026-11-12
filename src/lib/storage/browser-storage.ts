export const STORAGE_PREFIX = 'vokki-up';
export const STORAGE_VERSION = 1;

type StorageEnvelope = {
  version: number;
  value: unknown;
};

export type BrowserValueReadResult =
  | { status: 'missing' }
  | { status: 'valid'; value: unknown }
  | { status: 'invalid' }
  | { status: 'unavailable' };

function storageKey(key: string): string {
  return `${STORAGE_PREFIX}:${key}`;
}

export function readBrowserValueResult(key: string): BrowserValueReadResult {
  if (typeof window === 'undefined') return { status: 'unavailable' };

  let raw: string | null;
  try {
    raw = window.localStorage.getItem(storageKey(key));
  } catch {
    return { status: 'unavailable' };
  }
  if (raw === null) return { status: 'missing' };

  try {
    const envelope: unknown = JSON.parse(raw);
    if (
      !envelope ||
      typeof envelope !== 'object' ||
      !('version' in envelope) ||
      !('value' in envelope)
    ) {
      return { status: 'invalid' };
    }

    const stored = envelope as StorageEnvelope;
    return stored.version === STORAGE_VERSION
      ? { status: 'valid', value: stored.value }
      : { status: 'invalid' };
  } catch {
    return { status: 'invalid' };
  }
}

export function readBrowserValue(key: string): unknown {
  const result = readBrowserValueResult(key);
  return result.status === 'valid' ? result.value : undefined;
}

export function writeBrowserValue(key: string, value: unknown): void {
  if (typeof window === 'undefined') return;

  try {
    window.localStorage.setItem(
      storageKey(key),
      JSON.stringify({ version: STORAGE_VERSION, value })
    );
  } catch {
    // Storage can be unavailable or full; keep the in-memory interaction usable.
  }
}
