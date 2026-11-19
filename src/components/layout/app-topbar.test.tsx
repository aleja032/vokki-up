import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { ShellSlotsProvider } from './shell-slots';
import { AppTopbar } from './app-topbar';

const pathname = '/cards';
vi.mock('next/navigation', () => ({ usePathname: () => pathname }));

function render(sessionStatus: 'guest' | 'authenticated') {
  return renderToStaticMarkup(
    <ShellSlotsProvider avatarInitial="K" sessionStatus={sessionStatus}>
      <AppTopbar />
    </ShellSlotsProvider>
  );
}

describe('AppTopbar', () => {
  it('lists every navigation destination and marks the current route', () => {
    const html = render('guest');

    for (const href of ['/', '/cards', '/cards/word-library', '/notes'])
      expect(html).toContain(`href="${href}"`);
    expect(html).toContain('aria-current="page" class="top-nav__item"');
    expect(html).toContain('Vokki Up');
  });

  it('keeps settings as a pill for guests', () => {
    const html = render('guest');

    expect(html).toContain('href="/settings"');
    expect(html).toContain('>Ajustes</a>');
    expect(html).not.toContain('user-avatar');
  });

  it('moves settings behind the avatar once signed in', () => {
    const html = render('authenticated');

    expect(html).not.toContain('>Ajustes</a>');
    expect(html).toContain('class="user-avatar"');
    expect(html).toContain('aria-label="Ajustes y perfil"');
    expect(html).toContain('>K</a>');
  });
});
