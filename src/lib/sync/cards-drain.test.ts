import { describe, expect, it, vi } from 'vitest';
import type { SyncOperation, SyncTransport } from './types';
import { drainCardsQueue } from './cards-drain';

function operation(
  entityType: SyncOperation['entityType'],
  id: string
): SyncOperation {
  return {
    id,
    entityType,
    operation: 'upsert',
    entityId: `${entityType}-1`,
    payload: { name: 'example' },
    createdAt: '2026-10-23T12:00:00.000Z',
    attempts: 0,
    status: 'pending'
  };
}

describe('drainCardsQueue', () => {
  it('keeps guest or offline operations local without calling transport', async () => {
    const push = vi.fn<SyncTransport['push']>();
    const queue = [operation('card', 'card-op')];

    const result = await drainCardsQueue({
      queue,
      transport: { push },
      isAuthenticated: false,
      isOnline: true
    });

    expect(push).not.toHaveBeenCalled();
    expect(result.queue).toEqual(queue);
    expect(result.status).toBe('guest');
  });

  it('removes accepted Cards operations and preserves unrelated entities', async () => {
    const queue = [
      operation('card', 'accepted'),
      operation('card-group', 'rejected'),
      operation('note', 'local-note')
    ];
    const push = vi.fn<SyncTransport['push']>().mockResolvedValue({
      acceptedIds: ['accepted'],
      rejectedIds: [{ id: 'rejected', reason: 'schema_unavailable' }]
    });

    const result = await drainCardsQueue({
      queue,
      transport: { push },
      isAuthenticated: true,
      isOnline: true,
      now: new Date('2026-10-23T12:00:00.000Z')
    });

    expect(push).toHaveBeenCalledWith(queue.slice(0, 2));
    expect(result.queue.map(item => item.id)).toEqual([
      'rejected',
      'local-note'
    ]);
    expect(result.queue[0]).toMatchObject({
      attempts: 1,
      lastAttemptAt: '2026-10-23T12:00:00.000Z',
      lastErrorCode: 'schema_unavailable'
    });
    expect(result.status).toBe('partial');
  });

  it('leaves failed operations retryable and increments attempts', async () => {
    const queue = [operation('card-review', 'review-op')];
    const push = vi
      .fn<SyncTransport['push']>()
      .mockRejectedValue(new Error('network_error'));

    const result = await drainCardsQueue({
      queue,
      transport: { push },
      isAuthenticated: true,
      isOnline: true,
      now: new Date('2026-10-23T12:00:00.000Z')
    });

    expect(result.queue).toHaveLength(1);
    expect(result.queue[0]).toMatchObject({
      attempts: 1,
      lastErrorCode: 'network_error'
    });
    expect(result.status).toBe('error');
  });
});
