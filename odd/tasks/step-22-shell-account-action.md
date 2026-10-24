# Step 22 — Persistent Account Action

## Objective

Keep account access discoverable in the existing shell: guests see a login action and authenticated users see logout, without replacing the existing settings avatar or changing the visual system.

## Scope

- Add a reusable client account action that reads the Supabase auth session.
- Render it through the existing `ProfileActionSlot` when no custom slot is provided.
- Preserve the current shell structure, settings avatar, spacing, and styles.

## Acceptance criteria

- Guest users always see an accessible login icon/action in the shell.
- Authenticated users see the existing logout icon/action in the same slot.
- Loading state does not cause layout shift or expose an incorrect action.
- Existing settings navigation and all other UI remain unchanged.

## Verification

- `pnpm exec vitest run src/domains/auth`
- `pnpm exec tsc --noEmit`
- `pnpm lint`
- `pnpm build`

## Status

Implemented the reusable shell action and fallback slot without changing shell markup, CSS, or copy. Auth tests passed (1 file, 6 tests); typecheck, lint, and build passed; detector returned [].


