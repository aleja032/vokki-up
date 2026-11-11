'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { siteConfig, siteMessages } from '@/config/site';
import { isCurrentRoute } from './is-current-route.util';
import { navigationIcons } from './navigation-icons';

export function BottomNavigation() {
  const pathname = usePathname();

  return (
    <nav
      aria-label={siteMessages.navigationLabel}
      className="bottom-navigation"
    >
      {siteConfig.navigation.map(item => {
        const Icon = navigationIcons[item.icon];

        return (
          <Link
            aria-current={
              isCurrentRoute(pathname, item.href) ? 'page' : undefined
            }
            className="bottom-navigation__item"
            href={item.href}
            key={item.href}
          >
            <span className="bottom-navigation__pill">
              <Icon size={20} />
            </span>
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
