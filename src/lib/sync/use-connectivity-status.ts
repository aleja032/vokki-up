'use client';

import { useEffect, useState } from 'react';

export type ConnectivityStatus = 'unknown' | 'online' | 'offline';

export function useConnectivityStatus(): ConnectivityStatus {
  const [status, setStatus] = useState<ConnectivityStatus>('unknown');

  useEffect(() => {
    const update = () => setStatus(navigator.onLine ? 'online' : 'offline');
    update();
    window.addEventListener('online', update);
    window.addEventListener('offline', update);
    return () => {
      window.removeEventListener('online', update);
      window.removeEventListener('offline', update);
    };
  }, []);

  return status;
}
