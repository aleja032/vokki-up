import { describe, expect, it } from 'vitest';
import {
  extractErrorCode,
  getCredentialErrorKey
} from './credential-error-message.util';

describe('getCredentialErrorKey', () => {
  it.each([
    ['invalid_credential', 'invalidCredential'],
    ['invalid_selection', 'invalidSelection'],
    ['INVALID_SELECTION', 'invalidSelection'],
    ['INVALID_REQUEST', 'invalidSelection'],
    ['authentication_required', 'signInRequired'],
    ['AUTH_REQUIRED', 'keyRequired'],
    ['provider_mismatch', 'providerMismatch'],
    ['no_credential', 'noCredential'],
    ['supabase_not_configured', 'serviceUnavailable'],
    ['authentication_unavailable', 'serviceUnavailable'],
    ['credential_encryption_unavailable', 'serviceUnavailable'],
    ['credentials_unavailable', 'serviceUnavailable'],
    ['CAPABILITY_UNAVAILABLE', 'serviceUnavailable'],
    ['credential_save_failed', 'saveFailed'],
    ['credential_delete_failed', 'deleteFailed']
  ])('maps %s to %s', (code, key) => {
    expect(getCredentialErrorKey(code)).toBe(key);
  });

  it('falls back to a generic key for unknown codes', () => {
    expect(getCredentialErrorKey('something_new')).toBe('genericFailure');
    expect(getCredentialErrorKey('INTERNAL_ERROR')).toBe('genericFailure');
  });

  it('falls back to a generic key when the code is missing', () => {
    expect(getCredentialErrorKey(undefined)).toBe('genericFailure');
    expect(getCredentialErrorKey(null)).toBe('genericFailure');
    expect(getCredentialErrorKey('')).toBe('genericFailure');
  });
});

describe('extractErrorCode', () => {
  it('reads a string error code', () => {
    expect(extractErrorCode({ error: 'no_credential' })).toBe('no_credential');
  });

  it('reads a nested error code', () => {
    expect(
      extractErrorCode({ error: { code: 'AUTH_REQUIRED', message: 'raw' } })
    ).toBe('AUTH_REQUIRED');
  });

  it('returns undefined for unrecognized shapes', () => {
    expect(extractErrorCode(null)).toBeUndefined();
    expect(extractErrorCode('oops')).toBeUndefined();
    expect(extractErrorCode({ error: 3 })).toBeUndefined();
    expect(extractErrorCode({ error: { message: 'raw' } })).toBeUndefined();
  });
});
