'use client';

import type { ReactNode } from 'react';
import {
  ShellSlotsProvider,
  type ShellSessionStatus
} from '@/components/layout/shell-slots';
import { getAvatarInitial } from '@/lib/auth/avatar-initial.util';
import { useAuthSession } from '@/lib/auth/use-auth-session';
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
  const avatarInitial =
    session?.status === 'authenticated'
      ? getAvatarInitial(session.user)
      : undefined;

  return (
    <LocaleProvider>
      <ShellSlotsProvider
        profileAction={<AccountAction />}
        profileSummary={<ProfileSummary />}
        sessionStatus={sessionStatus}
        avatarInitial={avatarInitial}
      >
        {children}
      </ShellSlotsProvider>
    </LocaleProvider>
  );
}
