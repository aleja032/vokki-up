'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { VokkiLogo } from '@/components/brand/vokki-logo';
import { siteConfig, siteMessages } from '@/config/site';
import { ConnectionStatus } from './connection-status';
import { HeaderStreakPill } from './header-streak-pill';
import { isCurrentRoute } from './is-current-route.util';
import {
  AuthenticatedOnly,
  AvatarInitialSlot,
  ProfileActionSlot,
  ProfileSummarySlot,
  useShellSlots
} from './shell-slots';
import './app-topbar.css';

const settingsHref = '/settings';

// Desktop header from proposal D: brand, pill navigation, streak and account.
export function AppTopbar() {
  const pathname = usePathname();
  const { sessionStatus } = useShellSlots();
  const links = [...siteConfig.navigation] as {
    label: string;
    href: string;
  }[];
  // Signed-in people reach settings through the avatar, as in the proposal.
  // Guests have no avatar, so settings keeps its own pill for them.
  if (sessionStatus !== 'authenticated')
    links.push({ label: siteMessages.settings, href: settingsHref });

  return (
    <header className="app-topbar">
      <div className="app-topbar__inner">
        <Link
          aria-label={siteMessages.logoHomeLabel}
          className="brand app-topbar__brand"
          href="/"
        >
          <VokkiLogo className="brand__mark" size={28} />
          <span className="brand__wordmark">
            {siteConfig.brandPrimary} {siteConfig.brandAccent}
          </span>
        </Link>
        <nav aria-label={siteMessages.navigationLabel} className="top-nav">
          {links.map(item => (
            <Link
              aria-current={
                isCurrentRoute(pathname, item.href) ? 'page' : undefined
              }
              className="top-nav__item"
              href={item.href}
              key={item.href}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="app-topbar__actions">
          <HeaderStreakPill />
          <AuthenticatedOnly>
            <ConnectionStatus variant="header" />
          </AuthenticatedOnly>
          <ProfileSummarySlot />
          <AuthenticatedOnly>
            <Link
              aria-current={
                isCurrentRoute(pathname, settingsHref) ? 'page' : undefined
              }
              aria-label={siteMessages.settingsLinkLabel}
              className="user-avatar"
              href={settingsHref}
            >
              <AvatarInitialSlot />
            </Link>
          </AuthenticatedOnly>
          <ProfileActionSlot />
        </div>
      </div>
    </header>
  );
}
