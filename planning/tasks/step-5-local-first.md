# Step 5: Local-first storage and offline foundation

## Objective
Persist useful local learning state across reloads and provide a conservative offline shell without changing the Vokki Up proposal's UI direction.

## Scope
- Add a typed, versioned browser-storage boundary with safe handling for SSR, unavailable storage, corrupt data, and schema version mismatch.
- Persist Cards/groups, Notes, Writing draft/category, and non-secret Settings preferences where current local state permits.
- Add a minimal App Router-compatible service worker that caches visited same-origin page navigations and static Next assets, with an offline fallback document.
- Keep import/export preview, review queue/scheduling, provider calls, auth, sync, and cloud behavior out of scope.

## Route declaration
Delegated direct writer. The task spans multiple state-owning domains, shared storage, and the App Router layout; implementation reading and writing are kept in one bounded writer assignment.

## Acceptance criteria
- [x] Browser persistence uses a small typed/versioned boundary and never touches browser globals during server rendering.
- [x] Existing card, group, note, writing draft/category, and settings preference interactions restore after reload when browser storage is available.
- [x] Invalid or obsolete stored envelopes fall back to current mock defaults without crashing.
- [x] No secrets, provider credentials, review scheduling, or remote data are persisted or introduced.
- [x] Offline service worker registration is progressive enhancement and limited to production/supporting browsers; only same-origin GET pages/static assets are cached.
- [x] Offline fallback is available after the worker installs; visited navigations are cached on successful fetch, with private/no-store responses excluded.
- [x] Limitations are documented where current UI state should remain ephemeral.

## Verification
- `pnpm exec tsc --noEmit`
- `pnpm lint`
- `pnpm build`
- Read back changed source/task files and confirm no writes outside the allowed surfaces.

## Progress
- [x] Inspected current repo constraints, local state owners, and Next.js service-worker guidance.
- [x] Implement task-scoped storage and offline foundation.
- [x] Run and record required verification.

## Verification results
- `pnpm exec tsc --noEmit` — passed.
- `pnpm lint` — passed.
- `pnpm build` — passed; all 11 static App Router pages generated.
- Browser-level offline/reload interaction testing was not run in this task; verification is limited to static analysis and production build.

## Limitations
- Import/Export remains a transient CSV preview and is not connected to the persisted library.
- Review queue progress/ratings remain local UI-only; no scheduling or history is persisted.
- Persistence is per-browser localStorage, not IndexedDB, and does not synchronize or protect data across users sharing a browser profile.
- The service worker is installed only in production over a secure context; a visited page is cached after a successful navigation while controlled by the worker.

## Next step
Continue to Step 6 only after reviewing the local-first persistence and offline scope; no backend or synchronization behavior was added.
