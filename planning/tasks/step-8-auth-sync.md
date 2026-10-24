# Step 8: Local-First Auth and Sync Foundation

## Objective

Add typed guest/authenticated session and offline-first sync contracts while keeping every operation local; prepare explicit seams for a future Supabase adapter without requiring credentials.

## Scope

- Model guest and authenticated session states behind a local auth boundary.
- Add a login route using the existing AppShell and UI vocabulary, with guest access and clearly unavailable remote sign-in.
- Add typed sync operations and a validated, locally persisted queue boundary.
- Expose online/offline status and pending queue count without sending data remotely.
- Replace the Settings account placeholder with a login entry point.

Out of scope: Supabase SDK or requests, credentials, remote sync, account creation, token storage, and visual redesign.

## Route declaration

Direct implementation. The existing shell, persisted browser storage, and Settings account placeholder define the integration points. Changes remain within the authorized Step 8 surfaces.

## Acceptance criteria

- Auth state is discriminated as guest or authenticated, with a local implementation that defaults to guest and cannot fabricate remote authentication.
- Login is reachable at `/login`, matches the existing shell, and makes no remote calls or credential requirements.
- Sync operations and queue records have runtime validation and local persistence hooks; no network worker drains the queue.
- Connectivity reports unknown during initial hydration, then reflects browser online/offline events.
- Settings links to login; the interface clearly labels Supabase connection as future work.
- No secrets or tokens are stored in browser persistence.

## Verification

- `pnpm exec tsc --noEmit`
- `pnpm lint`
- `pnpm build`

## Progress

- [x] Inspected AppShell, existing localStorage helpers, Settings account placeholder, and header connection badge.
- [x] Implemented local guest/auth session contracts, local queue validation/persistence hook, online/offline status, and login route.
- [x] Ran queue validation tests, TypeScript, lint, and production build checks.

## Current limitation

Existing Cards, Notes, Writing, and Settings mutations continue to use their established local repositories; this step does not automatically enqueue every mutation. Sync-capable callers can enqueue typed changes through `useSyncQueue`, and a future authorized integration can connect those domain mutations to the same queue before implementing a remote drain.

## Next step

After explicit authorization and Supabase project configuration, implement a server-side auth/sync adapter against these contracts; preserve guest mode and never move credentials into localStorage.
