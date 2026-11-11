'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { AuthSession } from '@/lib/auth/types';
import { AUTH_SESSION_UPDATED_EVENT } from '@/lib/auth/events';
import { getAuthSessionBoundary } from '@/lib/auth/session';

export function useAuthSession(): {
  session: AuthSession | null;
  isLoading: boolean;
  refreshSession: () => Promise<void>;
} {
  const [session, setSession] = useState<AuthSession | null>(null);
  const requestId = useRef(0);
  const isMounted = useRef(false);

  const refreshSession = useCallback(async () => {
    const currentRequestId = ++requestId.current;
    try {
      const nextSession = await getAuthSessionBoundary().getSession();
      if (isMounted.current && requestId.current === currentRequestId) {
        setSession(nextSession);
      }
    } catch {
      if (isMounted.current && requestId.current === currentRequestId) {
        setSession({ status: 'guest' });
      }
    }
  }, []);

  useEffect(() => {
    isMounted.current = true;
    const refresh = () => void refreshSession();

    refresh();
    window.addEventListener(AUTH_SESSION_UPDATED_EVENT, refresh);
    return () => {
      isMounted.current = false;
      requestId.current += 1;
      window.removeEventListener(AUTH_SESSION_UPDATED_EVENT, refresh);
    };
  }, [refreshSession]);

  return { session, isLoading: session === null, refreshSession };
}
