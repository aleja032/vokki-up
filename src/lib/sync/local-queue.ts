import type { CreateSyncOperation, SyncOperation } from './types';
import { isSyncOperation, isSyncQueue } from './types';
import {
  readBrowserValue,
  writeBrowserValue
} from '../storage/browser-storage';

const STORAGE_KEY = 'sync/queue';
export const SYNC_QUEUE_UPDATED_EVENT = 'vokki-up:sync-queue-updated';

export function readLocalSyncQueue(): SyncOperation[] {
  const value = readBrowserValue(STORAGE_KEY);
  return isSyncQueue(value) ? value : [];
}

export function writeLocalSyncQueue(
  queue: SyncOperation[],
  notify = true
): void {
  if (!isSyncQueue(queue)) return;
  writeBrowserValue(STORAGE_KEY, queue);
  if (notify && typeof window !== 'undefined') {
    window.dispatchEvent(new Event(SYNC_QUEUE_UPDATED_EVENT));
  }
}

export function enqueueLocalSyncOperation(input: CreateSyncOperation): string {
  const operation: SyncOperation = {
    ...input,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    attempts: 0,
    status: 'pending'
  };
  if (!isSyncOperation(operation)) {
    throw new Error('Sync operation is invalid or contains credential fields.');
  }

  const queue = readLocalSyncQueue();
  writeLocalSyncQueue(coalesceSyncOperation(queue, operation));
  if (isCardsEntity(operation.entityType) && typeof window !== 'undefined') {
    void import('./cards-auto-sync').then(({ installCardsSyncAutoDrain }) => {
      installCardsSyncAutoDrain();
    });
  }
  return operation.id;
}

export function coalesceSyncOperation(
  queue: SyncOperation[],
  operation: SyncOperation
): SyncOperation[] {
  if (operation.entityType === 'card-review') return [...queue, operation];
  return [
    ...queue.filter(
      queued =>
        queued.entityType !== operation.entityType ||
        queued.entityId !== operation.entityId
    ),
    operation
  ];
}

export function removeLocalSyncOperation(id: string): void {
  writeLocalSyncQueue(
    readLocalSyncQueue().filter(operation => operation.id !== id)
  );
}

function isCardsEntity(entityType: SyncOperation['entityType']): boolean {
  return (
    entityType === 'card' ||
    entityType === 'card-group' ||
    entityType === 'card-schedule' ||
    entityType === 'card-review'
  );
}
