'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LogIn } from 'lucide-react';
import { getAuthSessionBoundary } from '@/lib/auth/session';
import { authMessages } from '../messages';
import { useAuthSession } from '../use-auth-session';
import { LogoutButton } from './logout-button';
import './login.css';

export function AccountAction() {
  const { session, isLoading, refreshSession } = useAuthSession();
  const router = useRouter();

  if (isLoading || session === null) {
    return (
      <span
        aria-hidden="true"
        className="signin-logout"
        data-variant="compact"
      />
    );
  }

  if (session.status === 'authenticated') {
    return (
      <LogoutButton
        variant="compact"
        onLogout={async () => {
          const result = await getAuthSessionBoundary().signOut();
          if (result.ok) {
            await refreshSession();
            router.replace('/login');
          }
        }}
      />
    );
  }

  return (
    <Link
      className="signin-login-cta"
      href="/login"
      title={authMessages.login.headerCta}
    >
      <LogIn aria-hidden="true" size={16} />
      <span className="signin-login-cta__label">
        {authMessages.login.headerCta}
      </span>
    </Link>
  );
}
