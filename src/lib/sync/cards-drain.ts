import type { SyncOperation, SyncTransport } from './types';

const cardsEntityTypes = new Set<SyncOperation['entityType']>([
  'card',
  'card-group',
  'card-schedule',
  'card-review'
]);

export type CardsSyncDrainStatus =
  | 'idle'
  | 'guest'
  | 'offline'
  | 'synced'
  | 'partial'
  | 'error';

export type CardsSyncDrainResult = {
  queue: SyncOperation[];
  status: CardsSyncDrainStatus;
  attemptedCount: number;
  acceptedCount: number;
  errorCode?: string;
};

export async function drainCardsQueue(input: {
  queue: SyncOperation[];
  transport: SyncTransport;
  isAuthenticated: boolean;
  isOnline: boolean;
  now?: Date;
}): Promise<CardsSyncDrainResult> {
  const cardsOperations = input.queue.filter(operation =>
    cardsEntityTypes.has(operation.entityType)
  );
  if (cardsOperations.length === 0) {
    return {
      queue: input.queue,
      status: 'idle',
      attemptedCount: 0,
      acceptedCount: 0
    };
  }
  if (!input.isOnline) {
    return {
      queue: input.queue,
      status: 'offline',
      attemptedCount: 0,
      acceptedCount: 0
    };
  }
  if (!input.isAuthenticated) {
    return {
      queue: input.queue,
      status: 'guest',
      attemptedCount: 0,
      acceptedCount: 0
    };
  }

  const attemptedAt = (input.now ?? new Date()).toISOString();
  try {
    const result = await input.transport.push(cardsOperations);
    const attemptedIds = new Set(
      cardsOperations.map(operation => operation.id)
    );
    const acceptedIds = new Set(
      result.acceptedIds.filter(id => attemptedIds.has(id))
    );
    const rejectedIds = new Map(
      result.rejectedIds
        .filter(item => attemptedIds.has(item.id))
        .map(item => [item.id, toErrorCode(item.reason)])
    );
    const unsuccessfulIds = new Set(
      cardsOperations
        .filter(
          operation =>
            !acceptedIds.has(operation.id) && !rejectedIds.has(operation.id)
        )
        .map(operation => operation.id)
    );
    for (const operation of cardsOperations) {
      if (!acceptedIds.has(operation.id) && !rejectedIds.has(operation.id)) {
        rejectedIds.set(operation.id, 'incomplete_response');
      }
    }

    const retainedQueue = input.queue.flatMap(operation => {
      if (acceptedIds.has(operation.id)) return [];
      const errorCode = rejectedIds.get(operation.id);
      if (!errorCode) return [operation];
      return [
        {
          ...operation,
          attempts: operation.attempts + 1,
          lastAttemptAt: attemptedAt,
          lastErrorCode: errorCode
        }
      ];
    });
    const acceptedCount = acceptedIds.size;
    const status =
      acceptedCount === cardsOperations.length
        ? 'synced'
        : acceptedCount > 0
          ? 'partial'
          : 'error';
    const firstError = [...rejectedIds.values()][0];

    return {
      queue: retainedQueue,
      status,
      attemptedCount: cardsOperations.length,
      acceptedCount,
      ...(firstError ? { errorCode: firstError } : {}),
      ...(unsuccessfulIds.size > 0
        ? { errorCode: firstError ?? 'incomplete_response' }
        : {})
    };
  } catch (error) {
    const errorCode = toErrorCode(
      error instanceof Error ? error.message : 'sync_failed'
    );
    const attemptedIds = new Set(
      cardsOperations.map(operation => operation.id)
    );
    return {
      queue: input.queue.map(operation =>
        attemptedIds.has(operation.id)
          ? {
              ...operation,
              attempts: operation.attempts + 1,
              lastAttemptAt: attemptedAt,
              lastErrorCode: errorCode
            }
          : operation
      ),
      status: 'error',
      attemptedCount: cardsOperations.length,
      acceptedCount: 0,
      errorCode
    };
  }
}

function toErrorCode(reason: string): string {
  const normalized = reason.toLowerCase().replace(/[^a-z0-9_-]/g, '_');
  return normalized.slice(0, 80) || 'sync_failed';
}
