export const ADD_HUB_MODES = ['image', 'words', 'manual'] as const;
export type AddHubMode = (typeof ADD_HUB_MODES)[number];

export const DEFAULT_ADD_HUB_MODE: AddHubMode = 'manual';

/** The image and word-list modes depend on AI; manual never does. */
export function isHubModeLocked(
  mode: AddHubMode,
  isAiEnabled: boolean
): boolean {
  return mode !== 'manual' && !isAiEnabled;
}

/** Modes are always listed; without AI only manual can be selected. */
export function getSelectableHubModes(isAiEnabled: boolean): AddHubMode[] {
  return ADD_HUB_MODES.filter(mode => !isHubModeLocked(mode, isAiEnabled));
}

/** Moves a locked AI mode (e.g. from a deep link) to manual. */
export function resolveHubMode(
  mode: AddHubMode,
  isAiEnabled: boolean
): AddHubMode {
  return isHubModeLocked(mode, isAiEnabled) ? 'manual' : mode;
}

/** Reads the `?mode=` deep link; unknown values keep the default (manual). */
export function parseAddHubMode(value: unknown): AddHubMode {
  return ADD_HUB_MODES.find(mode => mode === value) ?? DEFAULT_ADD_HUB_MODE;
}
