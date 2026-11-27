'use client';

import Link from 'next/link';
import { Settings } from 'lucide-react';
import { VokkiLogo } from '@/components/brand/vokki-logo';
import { siteConfig, siteMessages } from '@/config/site';
import { ConnectionStatus } from './connection-status';
import { HeaderStreakPill } from './header-streak-pill';
import {
  AuthenticatedOnly,
  AvatarInitialSlot,
  ProfileActionSlot,
  UnauthenticatedOnly
} from './shell-slots';

export function AppHeader() {
  return (
    <header className="app-header">
      <Link
        aria-label={siteMessages.mobileLogoLabel}
        className="brand app-header__brand"
        href="/"
      >
        <VokkiLogo className="brand__mark" size={28} />
        <span className="brand__wordmark">
          {siteConfig.brandPrimary} {siteConfig.brandAccent}
        </span>
      </Link>
      <div className="app-header__actions">
        <HeaderStreakPill />
        <AuthenticatedOnly>
          <ConnectionStatus variant="header" />
          <Link
            aria-label={siteMessages.settingsLinkLabel}
            className="user-avatar"
            href="/settings"
          >
            <AvatarInitialSlot />
          </Link>
        </AuthenticatedOnly>
        <UnauthenticatedOnly>
          <Link
            aria-label={siteMessages.settings}
            className="app-header__settings"
            href="/settings"
          >
            <Settings aria-hidden="true" size={20} strokeWidth={2} />
          </Link>
        </UnauthenticatedOnly>
        <ProfileActionSlot />
      </div>
    </header>
  );
}
