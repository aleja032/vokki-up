import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { AppHeader } from './app-header';
import { BottomNavigation } from './bottom-navigation';
import { ShellSlotsProvider } from './shell-slots';

vi.mock('next/navigation', () => ({ usePathname: () => '/cards' }));
vi.mock('./header-streak-pill', () => ({ HeaderStreakPill: () => null }));
vi.mock('./connection-status', () => ({ ConnectionStatus: () => null }));

function renderWith(
  sessionStatus: 'guest' | 'authenticated',
  node: React.ReactNode
) {
  return renderToStaticMarkup(
    <ShellSlotsProvider
      avatarInitial="K"
      profileAction={<a href="/login">Iniciar sesión</a>}
      sessionStatus={sessionStatus}
    >
      {node}
    </ShellSlotsProvider>
  );
}

describe('settings entry on phones', () => {
  it('puts a gear next to the sign in action for guests', () => {
    const html = renderWith('guest', <AppHeader />);

    expect(html).toContain('class="app-header__settings"');
    expect(html).toContain('href="/settings"');
    expect(html).toContain('aria-label="Ajustes"');
    expect(html.indexOf('app-header__settings')).toBeLessThan(
      html.indexOf('Iniciar sesión')
    );
  });

  it('keeps settings behind the avatar once signed in, with no gear', () => {
    const html = renderWith('authenticated', <AppHeader />);

    expect(html).not.toContain('app-header__settings');
    expect(html).toContain('class="user-avatar"');
  });

  it('no longer lists settings in the bottom navigation', () => {
    for (const status of ['guest', 'authenticated'] as const) {
      const html = renderWith(status, <BottomNavigation />);

      expect(html).not.toContain('href="/settings"');
      expect(html).toContain('href="/review"');
    }
  });
});
