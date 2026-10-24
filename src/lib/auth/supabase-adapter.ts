import type { AuthSessionBoundary } from '@/lib/auth/types';

import type { Session, User } from '@supabase/supabase-js';
import type { AuthCredentials, AuthResult, AuthSession } from './types';
import { AUTH_SESSION_UPDATED_EVENT } from './events';
import { getSupabaseBrowserClient } from '@/lib/supabase/browser-client';
import { installCardsSyncAutoDrain } from '@/lib/sync/cards-auto-sync';

function toAuthSession(session: Session | null): AuthSession {
  const user: User | undefined = session?.user;
  const email = user?.email;
  if (!user?.id || !email) return { status: 'guest' };

  const metadata = user.user_metadata as Record<string, unknown>;
  const displayName = metadata.full_name ?? metadata.name;
  return {
    status: 'authenticated',
    provider: 'supabase',
    user: {
      id: user.id,
      email,
      ...(typeof displayName === 'string' ? { displayName } : {})
    }
  };
}

function invalidCredentials(): AuthResult {
  return {
    ok: false,
    code: 'invalid_credentials',
    message: 'Enter a valid email address and password.'
  };
}

function providerFailure(message: string): AuthResult {
  return { ok: false, code: 'provider_error', message };
}

function notifySessionChange(): void {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new Event(AUTH_SESSION_UPDATED_EVENT));
  installCardsSyncAutoDrain();
}

/** Browser Auth boundary; guest mode remains available when public env is absent. */
export function createSupabaseAuthSessionBoundary(): AuthSessionBoundary | null {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) return null;

  return {
    async getSession(): Promise<AuthSession> {
      const { data, error } = await supabase.auth.getSession();
      if (error) return { status: 'guest' };
      return toAuthSession(data.session);
    },

    async signIn(credentials: AuthCredentials): Promise<AuthResult> {
      if (!isValidCredentials(credentials)) return invalidCredentials();
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email.trim(),
        password: credentials.password
      });
      if (error) return providerFailure(error.message);
      notifySessionChange();
      return {
        ok: true,
        session: toAuthSession(data.session),
        requiresEmailConfirmation: false
      };
    },

    async signUp(credentials: AuthCredentials): Promise<AuthResult> {
      if (!isValidCredentials(credentials)) return invalidCredentials();
      const { data, error } = await supabase.auth.signUp({
        email: credentials.email.trim(),
        password: credentials.password
      });
      if (error) return providerFailure(error.message);
      notifySessionChange();
      return {
        ok: true,
        session: toAuthSession(data.session),
        requiresEmailConfirmation: data.session === null
      };
    },

    async signOut(): Promise<AuthResult> {
      const { error } = await supabase.auth.signOut();
      if (error) return providerFailure(error.message);
      notifySessionChange();
      return {
        ok: true,
        session: { status: 'guest' },
        requiresEmailConfirmation: false
      };
    }
  };
}

function isValidCredentials(credentials: AuthCredentials): boolean {
  return (
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(credentials.email.trim()) &&
    credentials.password.length > 0
  );
}
