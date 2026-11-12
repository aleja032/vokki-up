import type { AiProvider } from './types';

export interface SavedCredentialSelection {
  provider: AiProvider;
  model: string;
}

export interface ProviderSaveInput {
  isAuthenticated: boolean;
  typedKey: string;
  savedCredential: SavedCredentialSelection | null;
  selectedProvider: AiProvider;
  selectedModel: string;
}

export type ProviderSaveAction =
  | { kind: 'post'; provider: AiProvider; model: string; apiKey: string }
  | { kind: 'patch'; provider: AiProvider; model: string }
  | { kind: 'needs-key-for-provider' }
  | { kind: 'transient'; apiKey: string }
  | { kind: 'none' };

/** Decides which request, if any, the provider Save button must perform. */
export function resolveProviderSaveAction(
  input: ProviderSaveInput
): ProviderSaveAction {
  const apiKey = input.typedKey.trim();
  if (!input.isAuthenticated) {
    return apiKey ? { kind: 'transient', apiKey } : { kind: 'none' };
  }
  if (apiKey) {
    return {
      kind: 'post',
      provider: input.selectedProvider,
      model: input.selectedModel,
      apiKey
    };
  }
  const saved = input.savedCredential;
  if (!saved) return { kind: 'none' };
  if (saved.provider !== input.selectedProvider)
    return { kind: 'needs-key-for-provider' };
  if (saved.model !== input.selectedModel) {
    return {
      kind: 'patch',
      provider: input.selectedProvider,
      model: input.selectedModel
    };
  }
  return { kind: 'none' };
}
