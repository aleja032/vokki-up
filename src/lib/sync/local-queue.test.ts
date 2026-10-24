import { describe, expect, it } from 'vitest';
import type { SyncOperation } from '@/lib/sync/types';
import { coalesceSyncOperation } from './local-queue';

function operation(
  entityType: SyncOperation['entityType'],
  entityId: string,
  id: string
): SyncOperation {
  return {
    id,
    entityType,
    operation: 'upsert',
    entityId,
    payload: { version: id },
    createdAt: '2026-10-23T12:00:00.000Z',
    attempts: 0,
    status: 'pending'
  };
}

describe('coalesceSyncOperation', () => {
  it('keeps only the newest pending mutation for a stable entity', () => {
    const first = operation('note', 'note-1', 'first');
    const second = operation('note', 'note-1', 'second');

    expect(coalesceSyncOperation([first], second)).toEqual([second]);
  });

  it('preserves append-only card review events', () => {
    const first = operation('card-review', 'event-1', 'first');
    const second = operation('card-review', 'event-2', 'second');

    expect(coalesceSyncOperation([first], second)).toEqual([first, second]);
  });
});
