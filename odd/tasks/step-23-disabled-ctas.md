# Step 23 — Disable Unavailable CTA Controls

## Objective

Ensure every CTA that is visually presented as unavailable and lacks a real handler is natively disabled or non-navigable, while preserving functional local actions.

## Scope

- Disable Cards save when form validation is invalid.
- Make AI capture generate/create/retry, image controls, batch proposal controls, and proposal actions non-interactive until implemented.
- Disable Settings provider actions without handlers (connection test and API-key removal).
- Preserve functional local actions such as Settings save, CSV export, and connected auth controls.

## Constraints

- Do not invent backend behavior or replace mock flows with fake success.
- Preserve the existing HTML visual structure and copy; only state/interaction behavior changes.
- Use native `disabled` for buttons and prevent navigation for disabled-looking links.

## Acceptance criteria

- A disabled-looking CTA cannot submit, navigate, or trigger a handler.
- Disabled controls expose the disabled state accessibly.
- Functional CTAs remain usable.
- No UI redesign or copy changes are introduced.

## Verification

- `pnpm exec vitest run src/domains/auth src/domains/cards src/domains/ai src/domains/settings`
- `pnpm exec tsc --noEmit`
- `pnpm lint`
- `pnpm build`
- Impeccable detector on changed UI files.

## Progress

- Route: direct implementation within the authorized scope.
- Trigger: this behavior change spans multiple UI components and requires coordinated interaction-state updates.
- Focused component tests are absent; existing domain tests will provide regression coverage alongside typecheck, lint, build, and the required detector.

## Status

Implemented native disabled semantics for invalid Cards save, disabled/guarded AI placeholders, and unavailable Settings provider actions while preserving wired local actions. Verification passed: 8 test files / 39 tests, typecheck, lint, build, and Impeccable detector ([]).

