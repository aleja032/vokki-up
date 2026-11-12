import type { SavedCredentialSelection } from './ai-provider-save.util';
import type { AiProvider } from './types';

export interface PendingChangesInput {
  isLanguageDirty: boolean;
  typedKey: string;
  isAuthenticated: boolean;
  savedCredential: SavedCredentialSelection | null;
  selectedProvider: AiProvider;
  selectedModel: string;
}

/** True when pressing Save would persist something not yet persisted. */
export function hasPendingChanges(input: PendingChangesInput): boolean {
  if (input.isLanguageDirty) return true;
  if (input.typedKey.trim()) return true;
  const saved = input.savedCredential;
  return (
    input.isAuthenticated &&
    saved !== null &&
    (saved.provider !== input.selectedProvider ||
      saved.model !== input.selectedModel)
  );
}
