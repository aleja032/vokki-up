export const STORAGE_PREFIX = 'vokki-up';
export const STORAGE_VERSION = 1;

type StorageEnvelope = {
  version: number;
  value: unknown;
};

function storageKey(key: string): string {
  return `${STORAGE_PREFIX}:${key}`;
}

export function readBrowserValue(key: string): unknown {
  if (typeof window === 'undefined') return undefined;

  try {
    const raw = window.localStorage.getItem(storageKey(key));
    if (!raw) return undefined;

    const envelope: unknown = JSON.parse(raw);
    if (
      !envelope ||
      typeof envelope !== 'object' ||
      !('version' in envelope) ||
      !('value' in envelope)
    ) {
      return undefined;
    }

    const stored = envelope as StorageEnvelope;
    return stored.version === STORAGE_VERSION ? stored.value : undefined;
  } catch {
    return undefined;
  }
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
