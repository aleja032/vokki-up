import { describe, expect, it } from 'vitest';
import { isSyncOperation } from './types';

describe('isSyncOperation', () => {
  it('accepts a pending local card upsert', () => {
    expect(
      isSyncOperation({
        id: 'op-1',
        entityType: 'card',
        operation: 'upsert',
        entityId: 'card-1',
        payload: { word: 'hello' },
        createdAt: '2026-10-23T12:00:00.000Z',
        attempts: 0,
        status: 'pending'
      })
    ).toBe(true);
  });

  it('rejects credentials and unknown state from persisted queue records', () => {
    expect(
      isSyncOperation({
        id: 'op-2',
        entityType: 'card',
        operation: 'upsert',
        entityId: 'card-2',
        payload: { apiKey: 'secret' },
        createdAt: '2026-10-23T12:00:00.000Z',
        attempts: 0,
        status: 'pending'
      })
    ).toBe(false);
  });

  it('rejects credential fields nested inside JSON arrays', () => {
    expect(
      isSyncOperation({
        id: 'op-3',
        entityType: 'note',
        operation: 'upsert',
        entityId: 'note-1',
        payload: { blocks: [[{ ['access_token']: 'secret' }]] },
        createdAt: '2026-10-23T12:00:00.000Z',
        attempts: 0,
        status: 'pending'
      })
    ).toBe(false);
  });
});
