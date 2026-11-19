'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Play } from 'lucide-react';
import { siteConfig, siteMessages } from '@/config/site';
import { isCurrentRoute } from './is-current-route.util';
import { navigationIcons, SettingsIcon } from './navigation-icons';

const settingsHref = '/settings';
const reviewHref = '/review';
// Destinations shown to the left of the raised center action.
const DESTINATIONS_BEFORE_ACTION = 2;

export function BottomNavigation() {
  const pathname = usePathname();

  function renderItem(href: string, label: string, icon: ReactNode) {
    return (
      <Link
        aria-current={isCurrentRoute(pathname, href) ? 'page' : undefined}
        className="bottom-navigation__item"
        href={href}
        key={href}
      >
        <span className="bottom-navigation__pill">{icon}</span>
        <span>{label}</span>
      </Link>
    );
  }

  const destinations = siteConfig.navigation.map(item => {
    const Icon = navigationIcons[item.icon];
    return renderItem(item.href, item.label, <Icon size={20} />);
  });
  const settings = renderItem(
    settingsHref,
    siteMessages.settings,
    <SettingsIcon size={20} />
  );

  return (
    <nav
      aria-label={siteMessages.navigationLabel}
      className="bottom-navigation"
    >
      {destinations.slice(0, DESTINATIONS_BEFORE_ACTION)}
      <Link
        aria-label={siteMessages.startRound}
        className="bottom-navigation__fab"
        href={reviewHref}
      >
        <span aria-hidden="true" className="bottom-navigation__fab-icon">
          <Play fill="currentColor" size={22} />
        </span>
        <span aria-hidden="true">{siteMessages.roundShort}</span>
      </Link>
      {destinations.slice(DESTINATIONS_BEFORE_ACTION)}
      {settings}
    </nav>
  );
}
