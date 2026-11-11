'use client';

import { getSupabaseBrowserClient } from '@/lib/supabase/browser-client';
import { AUTH_SESSION_UPDATED_EVENT } from '@/lib/auth/events';
import {
  readLocalSyncQueue,
  SYNC_QUEUE_UPDATED_EVENT,
  writeLocalSyncQueue
} from './local-queue';
import { drainCardsQueue, type CardsSyncDrainStatus } from './cards-drain';
import { createSupabaseSyncTransport } from './supabase-adapter';
import type { SyncOperation } from './types';

export const CARDS_SYNC_STATUS_EVENT = 'vokki-up:cards-sync-status';

export type CardsSyncStatusDetail = {
  status:
    | CardsSyncDrainStatus
    | 'syncing'
    | 'not_configured'
    | 'auth_unavailable';
  pendingCount: number;
  attemptedCount: number;
  acceptedCount: number;
  errorCode?: string;
};

let isInstalled = false;
let isDraining = false;
let shouldDrainAgain = false;

export function installCardsSyncAutoDrain(): void {
  if (typeof window === 'undefined' || isInstalled) return;
  isInstalled = true;
  window.addEventListener('online', requestCardsSyncDrain);
  window.addEventListener('focus', requestCardsSyncDrain);
  window.addEventListener(SYNC_QUEUE_UPDATED_EVENT, requestCardsSyncDrain);
  window.addEventListener('storage', requestCardsSyncDrain);
  window.addEventListener(AUTH_SESSION_UPDATED_EVENT, requestCardsSyncDrain);

  requestCardsSyncDrain();
}

export async function requestCardsSyncDrain(): Promise<void> {
  if (typeof window === 'undefined') return;
  if (isDraining) {
    shouldDrainAgain = true;
    return;
  }

  isDraining = true;
  try {
    const queue = readLocalSyncQueue();
    const pendingCount = countCardsOperations(queue);
    if (pendingCount === 0) {
      publishStatus({
        status: 'idle',
        pendingCount: 0,
        attemptedCount: 0,
        acceptedCount: 0
      });
      return;
    }
    if (!navigator.onLine) {
      publishStatus({
        status: 'offline',
        pendingCount,
        attemptedCount: 0,
        acceptedCount: 0
      });
      return;
    }

    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      publishStatus({
        status: 'not_configured',
        pendingCount,
        attemptedCount: 0,
        acceptedCount: 0
      });
      return;
    }

    const { data, error } = await supabase.auth.getSession();
    if (error) {
      publishStatus({
        status: 'auth_unavailable',
        pendingCount,
        attemptedCount: 0,
        acceptedCount: 0,
        errorCode: 'auth_unavailable'
      });
      return;
    }
    if (!data.session) {
      publishStatus({
        status: 'guest',
        pendingCount,
        attemptedCount: 0,
        acceptedCount: 0
      });
      return;
    }

    publishStatus({
      status: 'syncing',
      pendingCount,
      attemptedCount: 0,
      acceptedCount: 0
    });
    const result = await drainCardsQueue({
      queue,
      transport: createSupabaseSyncTransport(),
      isAuthenticated: true,
      isOnline: true
    });
    if (!sameQueue(queue, result.queue)) {
      writeLocalSyncQueue(result.queue, false);
    }
    publishStatus({
      status: result.status,
      pendingCount: countCardsOperations(result.queue),
      attemptedCount: result.attemptedCount,
      acceptedCount: result.acceptedCount,
      ...(result.errorCode ? { errorCode: result.errorCode } : {})
    });
  } catch {
    publishStatus({
      status: 'error',
      pendingCount: countCardsOperations(readLocalSyncQueue()),
      attemptedCount: 0,
      acceptedCount: 0,
      errorCode: 'sync_failed'
    });
  } finally {
    isDraining = false;
    if (shouldDrainAgain) {
      shouldDrainAgain = false;
      queueMicrotask(() => void requestCardsSyncDrain());
    }
  }
}

export function disposeCardsSyncAutoDrain(): void {
  if (typeof window === 'undefined' || !isInstalled) return;
  window.removeEventListener('online', requestCardsSyncDrain);
  window.removeEventListener('focus', requestCardsSyncDrain);
  window.removeEventListener(SYNC_QUEUE_UPDATED_EVENT, requestCardsSyncDrain);
  window.removeEventListener('storage', requestCardsSyncDrain);
  window.removeEventListener(AUTH_SESSION_UPDATED_EVENT, requestCardsSyncDrain);
  isInstalled = false;
}

function publishStatus(detail: CardsSyncStatusDetail): void {
  window.dispatchEvent(
    new CustomEvent<CardsSyncStatusDetail>(CARDS_SYNC_STATUS_EVENT, { detail })
  );
}

function countCardsOperations(queue: SyncOperation[]): number {
  return queue.filter(
    operation =>
      operation.entityType === 'card' ||
      operation.entityType === 'card-group' ||
      operation.entityType === 'card-schedule' ||
      operation.entityType === 'card-review'
  ).length;
}

function sameQueue(left: SyncOperation[], right: SyncOperation[]): boolean {
  return JSON.stringify(left) === JSON.stringify(right);
}
