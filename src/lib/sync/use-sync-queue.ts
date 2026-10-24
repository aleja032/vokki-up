'use client';

import { useCallback, useEffect, useState } from 'react';
import type { CreateSyncOperation, SyncOperation } from '@/lib/sync/types';
import {
  CARDS_SYNC_STATUS_EVENT,
  installCardsSyncAutoDrain,
  type CardsSyncStatusDetail
} from './cards-auto-sync';
import {
  enqueueLocalSyncOperation,
  readLocalSyncQueue,
  removeLocalSyncOperation,
  SYNC_QUEUE_UPDATED_EVENT
} from '@/lib/sync/local-queue';

export function useSyncQueue() {
  const [queue, setQueue] = useState<SyncOperation[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [syncStatus, setSyncStatus] = useState<CardsSyncStatusDetail>({
    status: 'idle',
    pendingCount: 0,
    attemptedCount: 0,
    acceptedCount: 0
  });

  useEffect(() => {
    const refresh = () => {
      setQueue(readLocalSyncQueue());
      setIsLoaded(true);
    };
    refresh();
    installCardsSyncAutoDrain();
    const updateStatus = (event: Event) => {
      const detail = (event as CustomEvent<CardsSyncStatusDetail>).detail;
      if (detail) {
        setSyncStatus(detail);
        refresh();
      }
    };
    window.addEventListener(SYNC_QUEUE_UPDATED_EVENT, refresh);
    window.addEventListener('storage', refresh);
    window.addEventListener(CARDS_SYNC_STATUS_EVENT, updateStatus);
    return () => {
      window.removeEventListener(SYNC_QUEUE_UPDATED_EVENT, refresh);
      window.removeEventListener('storage', refresh);
      window.removeEventListener(CARDS_SYNC_STATUS_EVENT, updateStatus);
    };
  }, []);

  const enqueue = useCallback((operation: CreateSyncOperation) => {
    return enqueueLocalSyncOperation(operation);
  }, []);

  const remove = useCallback((id: string) => removeLocalSyncOperation(id), []);

  return {
    queue,
    pendingCount: queue.length,
    isLoaded,
    syncStatus,
    enqueue,
    remove
  };
}
