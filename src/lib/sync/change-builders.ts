import type {
  CreateSyncOperation,
  JsonObject,
  JsonValue,
  SyncEntityType
} from '@/lib/sync/types';

export function collectionChangeBuilder<T extends { id: string }>(
  entityType: SyncEntityType
): (previous: T[], next: T[]) => CreateSyncOperation[] {
  return (previous, next) => {
    const previousById = new Map(previous.map(item => [item.id, item]));
    const nextById = new Map(next.map(item => [item.id, item]));
    const changes: CreateSyncOperation[] = [];

    for (const item of next) {
      const previousItem = previousById.get(item.id);
      if (!previousItem || !sameJson(previousItem, item)) {
        changes.push({
          entityType,
          operation: 'upsert',
          entityId: item.id,
          payload: toJsonObject(item)
        });
      }
    }

    for (const item of previous) {
      if (!nextById.has(item.id)) {
        changes.push({ entityType, operation: 'delete', entityId: item.id });
      }
    }
    return changes;
  };
}

export function scalarChangeBuilder<T extends JsonValue>(
  entityType: SyncEntityType,
  entityId: string
): (previous: T, next: T) => CreateSyncOperation[] {
  return (previous, next) => {
    if (sameJson(previous, next)) return [];
    return [
      {
        entityType,
        operation: 'upsert',
        entityId,
        payload: { value: next }
      }
    ];
  };
}

function sameJson(left: unknown, right: unknown): boolean {
  return JSON.stringify(left) === JSON.stringify(right);
}

function toJsonObject(value: unknown): JsonObject {
  const serialized: unknown = JSON.parse(JSON.stringify(value)) as unknown;
  if (!isJsonObject(serialized)) {
    throw new Error('Sync payload must be a JSON object.');
  }
  return serialized;
}

export function serializeSyncPayload(value: unknown): JsonObject {
  return toJsonObject(value);
}

function isJsonObject(value: unknown): value is JsonObject {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value) &&
    Object.values(value).every(isJsonValue)
  );
}

function isJsonValue(value: unknown): value is JsonValue {
  if (
    value === null ||
    typeof value === 'string' ||
    typeof value === 'boolean'
  ) {
    return true;
  }
  if (typeof value === 'number') return Number.isFinite(value);
  if (Array.isArray(value)) return value.every(isJsonValue);
  return isJsonObject(value);
}
