import { createLocalizedMessages } from '@/lib/i18n/locale';
export const shellMessages = createLocalizedMessages({
  profileName: 'Kiev',
  profileLevel: 'Nivel B1',
  connection: {
    checking: 'Conexión…',
    online: 'Sincronizado',
    upToDate: 'Al día',
    offline: 'Sin conexión'
  }
});

export const statusPageMessages = createLocalizedMessages({
  notFound: {
    eyebrow: 'Error 404',
    title: 'Esta página no existe',
    description:
      'Puede que el enlace esté mal escrito o que la tarjeta o nota se haya eliminado.',
    goHome: 'Ir al inicio',
    viewCards: 'Ver mis tarjetas',
    searchLabel: 'Buscar en Vokki Up',
    searchPlaceholder: 'Busca una palabra o una nota…'
  },
  error: {
    eyebrow: 'Error',
    title: 'Algo salió mal',
    description:
      'No pudimos mostrar esta pantalla. Tus tarjetas y notas siguen guardadas en tu dispositivo. Inténtalo de nuevo.',
    retry: 'Reintentar',
    goHome: 'Ir al inicio'
  },
  globalError: {
    eyebrow: 'Error',
    title: 'Algo salió mal',
    description:
      'La aplicación tuvo un problema inesperado. Tus tarjetas y notas siguen guardadas en tu dispositivo.',
    retry: 'Reintentar'
  },
  loading: {
    label: 'Cargando…'
  }
});
