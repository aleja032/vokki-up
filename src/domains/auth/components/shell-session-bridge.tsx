'use client';

import type { ReactNode } from 'react';
import {
  ShellSlotsProvider,
  type ShellSessionStatus
} from '@/components/layout/shell-slots';
import { useAuthSession } from '../use-auth-session';
import { AccountAction } from './account-action';
import { ProfileSummary } from './profile-summary';
import { LocaleProvider } from '@/lib/i18n/locale-provider';

export function ShellSessionBridge({ children }: { children: ReactNode }) {
  const { session, isLoading } = useAuthSession();
  const sessionStatus: ShellSessionStatus =
    isLoading || session === null
      ? 'loading'
      : session.status === 'authenticated'
        ? 'authenticated'
        : 'guest';

  return (
    <LocaleProvider>
      <ShellSlotsProvider
        profileAction={<AccountAction />}
        profileSummary={<ProfileSummary />}
        sessionStatus={sessionStatus}
      >
        {children}
      </ShellSlotsProvider>
    </LocaleProvider>
  );
}
