import { PROVIDER_OPTIONS } from './data';
import {
  extractErrorCode,
  getCredentialErrorKey,
  type CredentialErrorKey
} from './credential-error-message.util';
import type { AiProvider } from './types';

export interface CredentialStatus {
  authenticated: boolean;
  hasCredential: boolean;
  maskedKey: string | null;
  provider: AiProvider | null;
  model: string | null;
}

export type CredentialRequestResult =
  | { ok: true; status: CredentialStatus }
  | { ok: false; errorKey: CredentialErrorKey };

const ENDPOINT = '/api/settings/ai-credentials';

/** Calls the credentials API and returns a status or a localized error key. */
export async function requestCredentials(
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE',
  fallbackKey: CredentialErrorKey,
  body?: Record<string, string>
): Promise<CredentialRequestResult> {
  try {
    const response = await fetch(ENDPOINT, {
      method,
      cache: 'no-store',
      ...(body
        ? {
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
          }
        : {})
    });
    const value: unknown = await response.json();
    if (!response.ok) {
      const code = extractErrorCode(value);
      return {
        ok: false,
        errorKey: code ? getCredentialErrorKey(code) : fallbackKey
      };
    }
    return { ok: true, status: parseCredentialStatus(value) };
  } catch {
    return { ok: false, errorKey: fallbackKey };
  }
}

function parseCredentialStatus(value: unknown): CredentialStatus {
  const record =
    typeof value === 'object' && value !== null
      ? (value as Record<string, unknown>)
      : {};
  const provider = PROVIDER_OPTIONS.find(option => option.id === record.provider);
  return {
    authenticated: record.authenticated === true,
    hasCredential: record.hasCredential === true,
    maskedKey: typeof record.maskedKey === 'string' ? record.maskedKey : null,
    provider: provider?.id ?? null,
    model: typeof record.model === 'string' ? record.model : null
  };
}
