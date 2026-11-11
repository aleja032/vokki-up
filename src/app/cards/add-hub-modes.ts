export const ADD_HUB_MODES = ['image', 'words', 'manual'] as const;
export type AddHubMode = (typeof ADD_HUB_MODES)[number];

export const DEFAULT_ADD_HUB_MODE: AddHubMode = 'manual';

/** Reads the `?mode=` deep link; unknown values keep the default (manual). */
export function parseAddHubMode(value: unknown): AddHubMode {
  return ADD_HUB_MODES.find(mode => mode === value) ?? DEFAULT_ADD_HUB_MODE;
}
