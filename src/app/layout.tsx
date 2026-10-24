import type { Metadata } from 'next';
import {
  DM_Sans as dmSansFont,
  Fraunces as frauncesFont,
  Noto_Sans as notoSansFont
} from 'next/font/google';
import { siteConfig } from '@/config/site';
import { ServiceWorkerRegistration } from '@/components/pwa/service-worker-registration';
import { ShellSessionBridge } from '@/domains/auth/components/shell-session-bridge';
import './globals.css';
import './error-pages.css';

const dmSans = dmSansFont({
  variable: '--font-ui',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic']
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

export const metadata: Metadata = {
  title: siteConfig.title,
  description: siteConfig.description,
  applicationName: siteConfig.name,
  appleWebApp: {
    capable: true,
    title: siteConfig.name,
    statusBarStyle: 'default'
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${dmSans.variable} ${fraunces.variable} ${notoSans.variable}`}
      >
        <ShellSessionBridge>{children}</ShellSessionBridge>
        <ServiceWorkerRegistration />
      </body>
    </html>
  );
}
