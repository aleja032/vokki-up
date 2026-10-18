import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'vokki-icon.svg', 'vokki-maskable.svg', 'apple-touch-icon.png'],
      manifest: {
        id: '/',
        name: 'Vokki Up — Tu espacio de inglés',
        short_name: 'Vokki Up',
        description: 'Estudiá inglés a tu ritmo con notas, tarjetas y práctica guardadas en este dispositivo.',
        lang: 'es',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        background_color: '#fffdf8',
        theme_color: '#fffdf8',
        icons: [
          { src: '/vokki-icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: '/vokki-icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: '/vokki-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png}'],
        navigateFallback: '/index.html',
      },
    }),
  ],
})
