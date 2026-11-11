'use client';

import { useEffect } from 'react';

export function ServiceWorkerRegistration() {
  useEffect(() => {
    if (
      process.env.NODE_ENV !== 'production' ||
      !window.isSecureContext ||
      !('serviceWorker' in navigator)
    ) {
      return;
    }

    void navigator.serviceWorker
      .register('/sw.js', { scope: '/' })
      .catch(() => {
        // PWA support is progressive enhancement; the app remains usable without it.
      });
  }, []);

  return null;
}
