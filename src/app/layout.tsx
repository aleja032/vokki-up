import type { Metadata } from 'next';
import {
  Fraunces as frauncesFont,
  Noto_Sans as notoSansFont,
  Pixelify_Sans as pixelifySansFont,
  Plus_Jakarta_Sans as plusJakartaSansFont
} from 'next/font/google';
import { cookies } from 'next/headers';
import { siteConfig } from '@/config/site';
import { siteLocalizedMeta } from '@/config/site-localized-meta';
import {
  DEFAULT_LOCALE,
  LOCALE_COOKIE,
  isLocale,
  type Locale
} from '@/lib/i18n/locale-cookie';
import { ServiceWorkerRegistration } from '@/components/pwa/service-worker-registration';
import { ShellSessionBridge } from '@/domains/auth/components/shell-session-bridge';
import { THEME_INIT_SCRIPT } from '@/lib/theme/theme-init-script';
import './globals.css';
import './error-pages.css';

const plusJakartaSans = plusJakartaSansFont({
  variable: '--font-ui',
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500', '600', '700', '800'],
  style: ['normal', 'italic']
});

const pixelifySans = pixelifySansFont({
  variable: '--font-pixel',
  subsets: ['latin'],
  weight: ['500', '600', '700']
});

const notoSans = notoSansFont({
  variable: '--font-ipa',
  subsets: ['latin', 'latin-ext'],
  weight: ['400']
});

const fraunces = frauncesFont({
  variable: '--font-display',
  subsets: ['latin'],
  weight: ['500', '600'],
  style: ['normal', 'italic']
});

async function getRequestLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const value = cookieStore.get(LOCALE_COOKIE)?.value;
  return isLocale(value) ? value : DEFAULT_LOCALE;
}

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  return {
    title: siteLocalizedMeta[locale].title,
    description: siteLocalizedMeta[locale].description,
    applicationName: siteConfig.name,
    appleWebApp: {
      capable: true,
      title: siteConfig.name,
      statusBarStyle: 'default'
    }
  };
}

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getRequestLocale();
  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body
        className={`${plusJakartaSans.variable} ${pixelifySans.variable} ${fraunces.variable} ${notoSans.variable}`}
      >
        <ShellSessionBridge>{children}</ShellSessionBridge>
        <ServiceWorkerRegistration />
      </body>
    </html>
  );
}
