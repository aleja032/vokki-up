import type { Locale } from '@/lib/i18n/locale-cookie';

interface SiteLocalizedMeta {
  title: string;
  description: string;
}

export const siteLocalizedMeta: Record<Locale, SiteLocalizedMeta> = {
  es: {
    title: 'Vokki Up — Aprende a tu ritmo',
    description: 'Aprende vocabulario en contexto, cinco minutos a la vez.'
  },
  en: {
    title: 'Vokki Up — Learn at your own pace',
    description: 'Learn vocabulary in context, five minutes at a time.'
  }
};
