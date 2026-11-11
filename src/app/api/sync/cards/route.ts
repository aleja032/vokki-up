import { NextResponse } from 'next/server';
import {
  createSupabaseServerClient,
  SupabaseConfigurationError
} from '@/lib/supabase/server-client';
import { isSyncQueue } from '@/lib/sync/types';
import type { SyncOperation } from '@/lib/sync/types';

const cardsEntityTypes = new Set<SyncOperation['entityType']>([
  'card',
  'card-group',
  'card-schedule',
  'card-review'
]);

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return errorResponse('invalid_request', 400);
  }

  if (!isRequestBody(body) || !isSyncQueue(body.operations)) {
    return errorResponse('invalid_operations', 400);
  }
  if (
    body.operations.some(
      operation => !cardsEntityTypes.has(operation.entityType)
    )
  ) {
    return errorResponse('unsupported_entity', 400);
  }

  let supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>;
  try {
    supabase = await createSupabaseServerClient();
  } catch (error) {
    if (error instanceof SupabaseConfigurationError) {
      return errorResponse('supabase_not_configured', 503);
    }
    return errorResponse('auth_unavailable', 503);
  }

  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return errorResponse('not_authenticated', 401);

  // No table/RPC schema exists in this repository. Do not guess a remote contract.
  return NextResponse.json(
    { error: 'cards_schema_unavailable' },
    { status: 503, headers: { 'Cache-Control': 'private, no-store' } }
  );
}

function isRequestBody(value: unknown): value is { operations: unknown } {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value) &&
    Object.keys(value).length === 1 &&
    'operations' in value
  );
}

function errorResponse(error: string, status: number) {
  return NextResponse.json(
    { error },
    { status, headers: { 'Cache-Control': 'private, no-store' } }
  );
}
