'use client';

import { shellMessages } from '@/config/messages';
import { useAuthSession } from '../use-auth-session';

export function ProfileSummary() {
  const { session } = useAuthSession();

  if (session?.status !== 'authenticated') return null;

  return (
    <span className="app-sidebar__profile-copy">
      <strong>{session.user.displayName ?? session.user.email}</strong>
      <span>{shellMessages.profileLevel}</span>
    </span>
  );
}
