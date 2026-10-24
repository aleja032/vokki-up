export type GuestSession = { status: 'guest' };

export type AuthenticatedSession = {
  status: 'authenticated';
  provider: 'supabase';
  user: { id: string; email: string; displayName?: string };
};

export type AuthSession = GuestSession | AuthenticatedSession;

export type AuthCredentials = {
  email: string;
  password: string;
};

export type AuthResult =
  | {
      ok: true;
      session: AuthSession;
      requiresEmailConfirmation: boolean;
    }
  | {
      ok: false;
      code: 'not_configured' | 'invalid_credentials' | 'provider_error';
      message: string;
    };

export interface AuthSessionBoundary {
  getSession(): Promise<AuthSession>;
  signIn(credentials: AuthCredentials): Promise<AuthResult>;
  signUp(credentials: AuthCredentials): Promise<AuthResult>;
  signOut(): Promise<AuthResult>;
}
