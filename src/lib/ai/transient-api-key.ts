let transientApiKey: string | null = null;

/** Keeps guest credentials in this tab's memory only; never writes them to browser storage. */
export function setTransientAiApiKey(value: string | null) {
  transientApiKey = value?.trim() || null;
}

export function getTransientAiApiKey(): string | null {
  return transientApiKey;
}
