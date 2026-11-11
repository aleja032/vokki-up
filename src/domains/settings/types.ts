import type { AiProviderId } from '@/lib/ai/catalog';

export type AppTheme = 'light' | 'dark' | 'system';
export type AiProvider = AiProviderId;
export type SettingsTab = 'profile' | 'provider';

/** Banner state at the top of the AI provider tab. Static: nothing computes it yet. */
export type ConnectionStatus = 'unconfigured' | 'untested' | 'ok' | 'error';
/** Result of the "Probar conexión" action. Static: nothing runs a real test yet. */
export type ConnectionTest = 'idle' | 'testing' | 'ok' | 'error';

export type SavedAiCredential = {
  provider: AiProvider;
  model: string;
  maskedKey: string;
};
