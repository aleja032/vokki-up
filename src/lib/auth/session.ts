import type { AuthSession, AuthSessionBoundary } from '@/lib/auth/types';
import { createSupabaseAuthSessionBoundary } from './supabase-adapter';

/** Local-only adapter. It never reads tokens or claims a remote session. */
export const localGuestSession: AuthSessionBoundary = {
  async getSession(): Promise<AuthSession> {
    return { status: 'guest' };
  },
  async signIn(): Promise<{
    ok: false;
    code: 'not_configured';
    message: string;
  }> {
    return {
      ok: false,
      code: 'not_configured',
      message: 'Account sync is not configured; continue in guest mode.'
    };
  },
  async signUp(): Promise<{
    ok: false;
    code: 'not_configured';
    message: string;
  }> {
    return {
      ok: false,
      code: 'not_configured',
      message: 'Account sync is not configured; continue in guest mode.'
    };
  },
  async signOut(): Promise<{
    ok: true;
    session: AuthSession;
    requiresEmailConfirmation: false;
  }> {
    // Guest sessions hold no credentials and require no sign-out operation.
    return {
      ok: true,
      session: { status: 'guest' },
      requiresEmailConfirmation: false
    };
  }
};

export function getAuthSessionBoundary(): AuthSessionBoundary {
  return createSupabaseAuthSessionBoundary() ?? localGuestSession;
}
