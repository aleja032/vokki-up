export type CredentialErrorKey =
  | 'invalidCredential'
  | 'invalidSelection'
  | 'signInRequired'
  | 'keyRequired'
  | 'providerMismatch'
  | 'noCredential'
  | 'serviceUnavailable'
  | 'saveFailed'
  | 'deleteFailed'
  | 'loadFailed'
  | 'needsKeyForProvider'
  | 'genericFailure';

const ERROR_KEYS: Record<string, CredentialErrorKey> = {
  ['invalid_credential']: 'invalidCredential',
  ['invalid_selection']: 'invalidSelection',
  INVALID_SELECTION: 'invalidSelection',
  INVALID_REQUEST: 'invalidSelection',
  ['authentication_required']: 'signInRequired',
  AUTH_REQUIRED: 'keyRequired',
  ['provider_mismatch']: 'providerMismatch',
  ['no_credential']: 'noCredential',
  ['supabase_not_configured']: 'serviceUnavailable',
  ['authentication_unavailable']: 'serviceUnavailable',
  ['credential_encryption_unavailable']: 'serviceUnavailable',
  ['credentials_unavailable']: 'serviceUnavailable',
  CAPABILITY_UNAVAILABLE: 'serviceUnavailable',
  ['credential_save_failed']: 'saveFailed',
  ['credential_delete_failed']: 'deleteFailed'
};

/** Maps an API error code to a message key; never exposes raw API text. */
export function getCredentialErrorKey(
  code: string | null | undefined
): CredentialErrorKey {
  if (!code || !Object.hasOwn(ERROR_KEYS, code)) return 'genericFailure';
  return ERROR_KEYS[code];
}

/** Reads `{ error: 'code' }` or `{ error: { code } }` response bodies. */
export function extractErrorCode(value: unknown): string | undefined {
  if (typeof value !== 'object' || value === null || !('error' in value))
    return undefined;
  const error = value.error;
  if (typeof error === 'string') return error;
  if (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    typeof error.code === 'string'
  )
    return error.code;
  return undefined;
}
