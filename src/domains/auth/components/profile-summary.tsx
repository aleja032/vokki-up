'use client';

import { shellMessages } from '@/config/messages';
import { useAuthSession } from '../use-auth-session';

export function ProfileSummary() {
  const { session } = useAuthSession();

  if (session?.status !== 'authenticated') return null;

  const profileName = session.user.displayName ?? session.user.email;

  return (
    <span className="app-sidebar__profile-copy">
      <strong title={profileName}>{profileName}</strong>
      <span>{shellMessages.profileLevel}</span>
    </span>
  );
}
