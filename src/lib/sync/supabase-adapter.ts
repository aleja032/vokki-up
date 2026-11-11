'use client';

import type { SyncOperation, SyncPushResult, SyncTransport } from './types';

export class SyncTransportError extends Error {
  readonly code: string;

  constructor(code: string) {
    super(code);
    this.name = 'SyncTransportError';
    this.code = code;
  }
}

/** Sends only queued Cards operations; browser tokens remain in same-origin cookies. */
export function createSupabaseSyncTransport(): SyncTransport {
  return {
    async push(operations: SyncOperation[]): Promise<SyncPushResult> {
      const response = await fetch('/api/sync/cards', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ operations })
      });
      const body: unknown = await response.json().catch(() => null);
      if (!response.ok) {
        const code =
          isRecord(body) && typeof body.error === 'string'
            ? body.error
            : `http_${response.status}`;
        throw new SyncTransportError(code);
      }
      if (!isSyncPushResult(body)) {
        throw new SyncTransportError('invalid_sync_response');
      }
      return body;
    }
  };
}

function isSyncPushResult(value: unknown): value is SyncPushResult {
  return (
    isRecord(value) &&
    Array.isArray(value.acceptedIds) &&
    value.acceptedIds.every(isString) &&
    Array.isArray(value.rejectedIds) &&
    value.rejectedIds.every(
      item => isRecord(item) && isString(item.id) && isString(item.reason)
    )
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isString(value: unknown): value is string {
  return typeof value === 'string';
}
