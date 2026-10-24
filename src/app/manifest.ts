import type { MetadataRoute } from 'next';
import { siteConfig } from '@/config/site';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.name,
    ['short_name']: siteConfig.name,
    description: siteConfig.description,
    ['start_url']: '/',
    display: 'standalone',
    ['background_color']: '#F7F4EE',
    ['theme_color']: '#4A3AC9',
    lang: 'es'
  };
}
