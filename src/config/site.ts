import { createLocalizedMessages } from '@/lib/i18n/locale';
import { FEATURES } from './features';
export const siteConfig = createLocalizedMessages({
  name: 'Vokki Up',
  brandPrimary: 'Vokki',
  brandAccent: 'Up',
  title: 'Vokki Up — Aprende a tu ritmo',
  description: 'Aprende vocabulario en contexto, cinco minutos a la vez.',
  navigation: [
    { label: 'Inicio', href: '/', icon: 'home' },
    { label: 'Tarjetas', href: '/cards', icon: 'cards' },
    { label: 'Biblioteca', href: '/cards/word-library', icon: 'library' },
    ...(FEATURES.writing
      ? ([{ label: 'Escritura', href: '/writing', icon: 'writing' }] as const)
      : []),
    { label: 'Notas', href: '/notes', icon: 'notes' }
  ] as const
});

export const siteMessages = createLocalizedMessages({
  navigationLabel: 'Navegación principal',
  sectionLabel: 'Principal',
  settings: 'Ajustes',
  settingsLinkLabel: 'Ajustes y perfil',
  toggleCollapsed: 'Contraer menú',
  toggleExpanded: 'Expandir menú',
  connectionStatus: 'Sin conexión',
  logoHomeLabel: 'Vokki Up, inicio',
  mobileLogoLabel: 'Vokki Up, inicio'
});
