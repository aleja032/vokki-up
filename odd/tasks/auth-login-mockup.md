# auth-login-mockup

## Objective
Simple login MOCKUP (no real auth) plus a presentational logout button. The user will connect the real auth themselves.

## Why
Current `/login` is an informational "account and sync" page with no form, using `settings-*` classes that are being re-homed in the Settings module.

## Scope / authorized surface
`src/domains/auth/**`, `src/app/login/**`. Phase 2 (after the shell writer finishes): hide shell chrome on `/login` and mount the logout button in the sidebar profile block / mobile avatar via a slot filled from `src/app/layout.tsx` (components must not import domains).
Out of scope: real authentication, Supabase calls, sign-up, password reset, route protection.

## Decisions (made by the agent, user may revert)
- Form: email + password with RHF + Zod (per rules), submit calls an optional `onLogin` prop that defaults to a no-op; server/root errors through `setError('root')` so the user can wire the real call.
- Logout: presentational `LogoutButton` with `onLogout` prop (default no-op); shown inside the login screen when `useAuthSession` reports an authenticated session, and mounted in the shell in Phase 2.
- Guest mode kept: a "Continuar sin cuenta" link to `/` (the app is local-first).
- Own CSS with `@apply` and a new class prefix (`signin-`), no `settings-*` classes.

## Tasks
- [x] L1 Login screen + form (schema, hook, messages, component, CSS, schema test). Verified by writer: tsc/eslint clean, 56 tests; real-keystroke smoke OK.
- [x] L2 LogoutButton component (`onLogout` prop, `full` | `compact` variants).
- [x] L3 (Phase 2) `/login` standalone (no AppShell); logout mounted via `ShellSlotsProvider` slot (sidebar profile row, 92px rail, mobile header). Plug the real call in `handleLogout` at `src/domains/auth/components/shell-logout-button.tsx`. Verified by writer: tsc/eslint clean, 56 tests, bounding boxes at 1440/768/390/360. `/cards` has no mobile header at 390/360 (cards layout), so logout is not visible there on mobile.

## Acceptance criteria
- `npx tsc --noEmit`, `npx eslint src`, `npx vitest run` pass; new schema test written first.
- `/login` renders in light/dark at 1440, 768, 390 with no console/hydration errors; real keystrokes show validation errors and a clean valid submit.

## Progress
L1/L2 delegated.

## Verification evidence
(pending)

## Next step
Verify L1/L2, then L3.
