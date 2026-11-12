type AuthErrorLike = {
  name?: unknown;
  message?: unknown;
  status?: unknown;
};

/**
 * Supabase returns this error from `auth.getUser()` for visitors without a
 * session. It means "no user", not "authentication is unavailable".
 */
export function isMissingSessionError(error: unknown): boolean {
  if (typeof error !== 'object' || error === null) return false;
  const candidate = error as AuthErrorLike;
  if (candidate.name === 'AuthSessionMissingError') return true;
  return (
    candidate.status === 400 &&
    typeof candidate.message === 'string' &&
    /session missing/i.test(candidate.message)
  );
}
