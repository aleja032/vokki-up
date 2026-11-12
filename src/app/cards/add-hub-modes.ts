export const ADD_HUB_MODES = ['image', 'words', 'manual'] as const;
export type AddHubMode = (typeof ADD_HUB_MODES)[number];

export const DEFAULT_ADD_HUB_MODE: AddHubMode = 'manual';

/** Without AI only the manual mode can be selected. */
export function getSelectableHubModes(isAiEnabled: boolean): AddHubMode[] {
  return isAiEnabled ? [...ADD_HUB_MODES] : ['manual'];
}

/** Moves an AI mode (e.g. from a deep link) to manual when AI is disabled. */
export function resolveHubMode(
  mode: AddHubMode,
  isAiEnabled: boolean
): AddHubMode {
  return getSelectableHubModes(isAiEnabled).includes(mode) ? mode : 'manual';
}

/** Reads the `?mode=` deep link; unknown values keep the default (manual). */
export function parseAddHubMode(value: unknown): AddHubMode {
  return ADD_HUB_MODES.find(mode => mode === value) ?? DEFAULT_ADD_HUB_MODE;
}
