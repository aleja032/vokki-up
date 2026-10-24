'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getAuthSessionBoundary } from '@/lib/auth/session';
import { useAuthSession } from '../use-auth-session';
import type { LoginInput } from '../login.schema';
import { authMessages } from '../messages';
import { AuthBrand } from './auth-brand';
import { LoginForm } from './login-form';
import './login.css';

const messages = authMessages.login;

export function LoginWorkspace() {
  const router = useRouter();
  const { session, isLoading, refreshSession } = useAuthSession();

  useEffect(() => {
    if (session?.status === 'authenticated') {
      router.replace('/');
    }
  }, [router, session]);

  async function handleLogin({ email, password }: LoginInput) {
    const result = await getAuthSessionBoundary().signIn({ email, password });
    if (!result.ok) throw new Error(result.message);
    await refreshSession();
    router.replace('/');
  }

  if (session?.status === 'authenticated') {
    return null;
  }

  return (
    <div className="signin-workspace">
      <section
        className="signin-card"
        aria-labelledby="signin-title"
        aria-busy={isLoading}
      >
        <AuthBrand />
        <header className="signin-card__header">
          <h1 id="signin-title">{messages.title}</h1>
          <p>{messages.subtitle}</p>
        </header>
        <LoginForm onLogin={handleLogin} />
      </section>
    </div>
  );
}
