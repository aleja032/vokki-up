# Notes navigation and Cards pagination

## Objective

Make Notes and Cards usable as their collections grow without changing the approved visual language.

## Scope

- Return to the Notes list after an explicit save.
- Promote favorite notes before non-favorites while preserving filters and search.
- Bound note/category content areas with internal scroll instead of unbounded page growth.
- Add accessible Cards pagination that resets or clamps when filters/search change.
- Keep autosave and local-first persistence intact.

## Acceptance criteria

- Saving a note returns to the Notes list and preserves the saved content.
- Favorite notes appear first in the active Notes result set; the Favorites filter still works.
- Notes and category collections use bounded max heights with vertical scrolling.
- Cards show a stable page size, accessible previous/next controls, and correct empty/filtered states.
- Pagination resets when search/filter changes and clamps when the result count shrinks.
- Focused tests, typecheck, lint, and diff checks pass.

## Tasks

- [x] NOTES-01 Save navigation and favorite-first ordering.
- [x] NOTES-02 Bounded Notes/category scroll.
- [x] CARDS-01 Add Cards pagination and responsive controls.

## Route

Delegated direct: one writer owns the bounded Notes and Cards implementation; parent performs a focused spot check and verification.

## Constraints

- Preserve the approved UI and existing local-first behavior.
- Do not add Storybook, Docker, or unrelated design changes.
- Do not commit or push from the writer.

## Delivery

- Strategy: ask-on-risk; this slice will be committed separately from the already-created settings/AI/reminder slices.

## Verification

- `pnpm exec vitest run src/domains/notes/note.schema.test.ts src/domains/cards/hooks/pagination.test.ts` — passed (12 tests).
- `pnpm exec tsc --noEmit` — passed.
- `pnpm lint` — passed.
- `git diff --check` — passed.
- Impeccable detector on changed Notes/Cards UI files — no findings.
- No commit created; delivery remains with the parent.
