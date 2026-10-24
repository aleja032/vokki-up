# Step 21 — Wire Supabase Auth UI

## Objective

Connect the existing login and authenticated-session UI to the implemented Supabase auth boundary without changing the approved visual structure or styling.

## Scope

- Wire the existing login form to `signIn`.
- Surface Supabase errors through the existing form-level error state.
- Wire the existing logout button to `signOut` and refresh session state.
- Preserve the guest link and current markup/styles.

## Acceptance criteria

- Valid credentials invoke Supabase sign-in through the existing form.
- Authenticated users see the existing session card.
- Logout invokes Supabase sign-out and returns to the existing login form.
- Invalid/provider errors remain accessible and non-blocking.
- No CSS/layout/copy changes are introduced.

## Verification

- `pnpm exec vitest run src/domains/auth`
- `pnpm exec tsc --noEmit`
- `pnpm lint`
- `pnpm build`

## Status`r`n`r`nImplemented. Auth tests, typecheck, lint, build, and Impeccable detector passed. UI markup, styles, copy, and layout were unchanged.



