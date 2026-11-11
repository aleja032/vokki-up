export type SyncEntityType =
  | 'card'
  | 'card-group'
  | 'card-schedule'
  | 'card-review'
  | 'note'
  | 'writing-draft'
  | 'settings';
export type SyncOperationKind = 'upsert' | 'delete';
export type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | JsonObject;
export type JsonObject = { [key: string]: JsonValue };

export type SyncOperation = {
  id: string;
  entityType: SyncEntityType;
  operation: SyncOperationKind;
  entityId: string;
  payload?: JsonObject;
  createdAt: string;
  attempts: number;
  status: 'pending';
  lastAttemptAt?: string;
  lastErrorCode?: string;
};

export type CreateSyncOperation = Pick<
  SyncOperation,
  'entityType' | 'operation' | 'entityId'
> & { payload?: JsonObject };

export type SyncPushResult = {
  acceptedIds: string[];
  rejectedIds: Array<{ id: string; reason: string }>;
};

export interface SyncTransport {
  push(operations: SyncOperation[]): Promise<SyncPushResult>;
}

const entityTypes: SyncEntityType[] = [
  'card',
  'card-group',
  'card-schedule',
  'card-review',
  'note',
  'writing-draft',
  'settings'
];
const operationKinds: SyncOperationKind[] = ['upsert', 'delete'];
const credentialField = /(token|secret|password|api.?key|authorization)/i;

export function isSyncOperation(value: unknown): value is SyncOperation {
  if (
    !isRecord(value) ||
    !hasOnlyKeys(value, [
      'id',
      'entityType',
      'operation',
      'entityId',
      'payload',
      'createdAt',
      'attempts',
      'status',
      'lastAttemptAt',
      'lastErrorCode'
    ])
  )
    return false;
  return (
    isNonEmptyString(value.id) &&
    entityTypes.some(entityType => entityType === value.entityType) &&
    operationKinds.some(operation => operation === value.operation) &&
    isNonEmptyString(value.entityId) &&
    (value.payload === undefined ||
      (isJsonObject(value.payload) &&
        !containsCredentialField(value.payload))) &&
    typeof value.createdAt === 'string' &&
    Number.isFinite(Date.parse(value.createdAt)) &&
    typeof value.attempts === 'number' &&
    Number.isInteger(value.attempts) &&
    value.attempts >= 0 &&
    (value.lastAttemptAt === undefined ||
      (typeof value.lastAttemptAt === 'string' &&
        Number.isFinite(Date.parse(value.lastAttemptAt)))) &&
    (value.lastErrorCode === undefined ||
      (typeof value.lastErrorCode === 'string' &&
        /^[a-z0-9_-]{1,80}$/i.test(value.lastErrorCode))) &&
    value.status === 'pending'
  );
}

export function isSyncQueue(value: unknown): value is SyncOperation[] {
  return Array.isArray(value) && value.every(isSyncOperation);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function isJsonObject(value: unknown): value is JsonObject {
  return isRecord(value) && Object.values(value).every(isJsonValue);
}

function isJsonValue(value: unknown): value is JsonValue {
  if (value === null || typeof value === 'string' || typeof value === 'boolean')
    return true;
  if (typeof value === 'number') return Number.isFinite(value);
  if (Array.isArray(value)) return value.every(isJsonValue);
  return isJsonObject(value);
}

function containsCredentialField(value: unknown): boolean {
  if (Array.isArray(value)) return value.some(containsCredentialField);
  if (!isRecord(value)) return false;
  return Object.entries(value).some(
    ([key, nested]) =>
      credentialField.test(key) || containsCredentialField(nested)
  );
}

function hasOnlyKeys(value: Record<string, unknown>, keys: string[]): boolean {
  return Object.keys(value).every(key => keys.includes(key));
}
