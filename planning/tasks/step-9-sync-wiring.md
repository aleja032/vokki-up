# Step 9: Wire Local Mutations to Sync Queue

## Objective

Connect existing local changes in Cards, Notes, Writing, and Settings to the typed sync queue without introducing network behavior or changing the UI.

## Scope

- Add reusable tracked-state adapters and entity-diff helpers that enqueue validated changes.
- Wire card and group creation, note create/edit/save, writing draft/category changes, settings preferences, and review scheduling/events.
- Make queue writes use a shared local read-modify-write boundary so independent module hooks do not overwrite each other's pending entries.
- Preserve local persistence as the source of truth and leave queue draining for a later authorized adapter.

Out of scope: remote operations, Supabase, credentials, UI redesign, queue drain/retry policy, and changes outside the authorized surfaces.

## Route declaration

Direct implementation. The tracked-state integration points and sync queue API are already established; keep queue behavior centralized in reusable adapters to avoid module-specific persistence duplication.

## Acceptance criteria

- Successful persisted local mutations append typed pending operations to the browser queue.
- Repeated edits to collection entities enqueue only changed or removed entities; pending mutations for the same entity coalesce to the newest state, while review events remain append-only.
- Settings/Writing scalar changes use explicit stable entity IDs.
- Concurrent module hooks append through the same synchronous local queue boundary and do not overwrite one another's queue snapshots.
- Review ratings enqueue both schedule changes and append-only review events.
- Queue validation still rejects credentials and malformed operations; no code drains the queue or calls a remote service.
- UI structure and copy remain unchanged except incidental status if strictly required.

## Verification

- `pnpm exec tsc --noEmit`
- `pnpm lint`
- `pnpm build`
- Focused tests for change detection and queue operation shaping.

## Progress

- [x] Mapped existing local mutation and persistence points in Cards, Notes, Writing, Settings, and review scheduling.
- [x] Implemented central queue append/remove, entity coalescing, and reusable tracked state/change builders.
- [x] Wired Cards/groups/schedules/review events, Notes, Writing, and persisted Settings changes; added focused tests.
- [x] Ran focused sync tests, TypeScript, lint, and production build checks.

## Current limitation

Queue entries are local pending records only. No sync transport is invoked, and remote conflict resolution is not part of this step.

## Next step

Only after explicit authorization, add a server-backed sync drain/transport with idempotency and conflict handling; keep local repositories usable offline.
