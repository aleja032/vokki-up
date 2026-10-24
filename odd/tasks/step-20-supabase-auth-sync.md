# Step 20 — Supabase Auth + Cards Sync

## Objective

Connect the Next.js app to Supabase for email/password authentication and a first authenticated Cards synchronization slice, while preserving guest local-first behavior.

## Scope

- Add a browser/server Supabase client boundary using the public project URL and publishable key.
- Replace the local guest-only auth boundary with Supabase session restore, sign-in, sign-up, and sign-out.
- Keep unauthenticated users local-only.
- Drain queued card, group, schedule, and review operations for authenticated users with idempotent upsert/delete semantics and retry-safe failures.
- Keep Notes, Writing, Settings, and AI provider work outside this slice.

## Constraints

- Never expose Supabase secret/service-role keys in the browser or committed files.
- Follow the visual HTML source of truth; make only the minimum auth/sync UI changes needed.
- Do not change remote schema unless the existing schema is verified first.

## Tasks

- [x] S20.1 Add Supabase SSR/browser clients and environment validation.
- [x] S20.2 Implement authenticated session boundary and login actions.
- [x] S20.3 Implement Cards sync transport, queue drain, retry behavior, and reconnect trigger.
- [x] S20.4 Verify typecheck, lint, tests, and build; record remote-schema blockers honestly.

## Acceptance criteria

- A configured user can sign in and restore the Supabase session after refresh.
- A user can sign out; guest mode remains usable without network access.
- Local card changes queue while offline and drain once online for an authenticated user.
- A failed push remains queued with an incremented attempt count and a visible non-blocking status.
- No secret key is read by client code or committed to the repository.

## Route

Delegated direct: implementation touches multiple non-trivial auth/sync files; one bounded writer followed by parent spot-check.

## Verification

- `pnpm exec tsc --noEmit`
- `pnpm lint`
- `pnpm exec vitest run src/lib/sync`
- `pnpm build`

## Status

In progress.

