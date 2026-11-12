import { describe, expect, it } from 'vitest';
import { isMissingSessionError } from './auth-session.util';

describe('isMissingSessionError', () => {
  it('detects the AuthSessionMissingError name', () => {
    expect(
      isMissingSessionError({
        name: 'AuthSessionMissingError',
        message: 'x',
        status: 400
      })
    ).toBe(true);
  });

  it('detects a 400 with a session missing message', () => {
    expect(
      isMissingSessionError({ message: 'Auth session missing!', status: 400 })
    ).toBe(true);
  });

  it('rejects other errors and empty values', () => {
    expect(isMissingSessionError(null)).toBe(false);
    expect(isMissingSessionError(undefined)).toBe(false);
    expect(isMissingSessionError({ message: 'boom', status: 500 })).toBe(
      false
    );
    expect(
      isMissingSessionError({ message: 'Auth session missing!', status: 500 })
    ).toBe(false);
  });
});
