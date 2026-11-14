# Cards Library Controls: Individual Card Deletion

## Objective

Add a per-card three-dots menu to the Cards screen with a confirmation flow that deletes only the selected personal card and its card-scoped scheduling/review data.

## Problem and Why

Cards can be added but currently have no individual deletion action in the Cards screen. The earlier removal work was reverted because it changed Word Library behavior; this task puts the affordance in the correct Cards-only surface and preserves the shared vocabulary catalog.

## Scope and Constraints

- Add the menu and confirmation to each card rendered by the Cards screen.
- Delete the selected card, its card schedule, and only review events belonging to that card.
- Keep aggregate review sessions; they cannot be attributed to an individual card.
- Do not enqueue review-event sync deletions because card-review sync operations are append-only.
- Do not change Word Library components, styles, hooks, data, or catalog.
- Work on `stage`; commit the completed work unit and do not push.
- Authorized edit surfaces: `src/domains/cards/components/cards-dashboard.tsx`, `src/domains/cards/components/cards-library.tsx`, `src/domains/cards/components/vocabulary-card-item.tsx`, `src/domains/cards/components/cards.css`, `src/domains/cards/hooks/use-cards-dashboard.ts`, `src/domains/cards/messages.ts`, `src/domains/cards/personal-card-removal.ts`, `src/domains/cards/personal-card-removal.test.ts`, and this task document.

## Route and Delivery

- Route: delegated direct; the implementation spans multiple non-trivial UI, persistence, and test files.
- Trigger: menu/confirmation UI, card and progress cleanup, and focused tests require coordinated changes.
- Forecast: approximately 180 authored changed lines, excluding generated files.
- Delivery strategy: ask-on-risk; no PR or push is authorized.

## Tasks

- [ ] CDEL-01 — Implement and verify Cards-screen individual deletion with safe per-card progress cleanup.

## Acceptance Criteria

- Every personal card in the Cards list has an accessible three-dots menu with a delete action.
- Selecting delete requires confirmation that explains the card's review progress will be lost.
- The original title, pronunciation, and part-of-speech alignment remains unchanged; the part-of-speech label can wrap instead of being clipped.
- The small overflow trigger is absolutely positioned in the non-content upper-left corner and causes no card-layout reflow or extra whitespace.
- Confirming removes only that card, its schedule, and its review events; unrelated cards and progress remain.
- Aggregate review sessions and the Word Library catalog remain unchanged.
- No card-review sync delete operation is added.

## Applicable Checks

- `pnpm exec vitest run src/domains/cards/personal-card-removal.test.ts`
- `pnpm exec tsc --noEmit`
- `pnpm exec eslint src/domains/cards/components/cards-dashboard.tsx src/domains/cards/components/cards-library.tsx src/domains/cards/components/vocabulary-card-item.tsx src/domains/cards/hooks/use-cards-dashboard.ts src/domains/cards/messages.ts src/domains/cards/personal-card-removal.ts src/domains/cards/personal-card-removal.test.ts`
- `pnpm exec prettier --check src/domains/cards/components/cards-dashboard.tsx src/domains/cards/components/cards-library.tsx src/domains/cards/components/vocabulary-card-item.tsx src/domains/cards/components/cards.css src/domains/cards/hooks/use-cards-dashboard.ts src/domains/cards/messages.ts src/domains/cards/personal-card-removal.ts src/domains/cards/personal-card-removal.test.ts odd/tasks/cards-library-controls.md`
- `git diff --check`

## Progress and Evidence

- CDEL-01 is in progress. The helper test passes (3 tests); TypeScript, targeted ESLint, Prettier, and the final Impeccable detector pass. The full suite currently fails only `message-coverage.test.ts` for four new untranslated Spanish strings; translation-map path authorization is pending.
- User feedback rejected a separate action row and any movement of the part-of-speech label; the action now overlays the non-content upper-left card corner outside normal layout flow.
- Live responsive browser inspection was unavailable: CUA exposed no browser; the existing Chrome window was minimized.
- Review status observed before implementation: receipt-driven development is on (global default).

## Next Step

After translation-map path authorization, add the English mappings, rerun the full suite, verify responsive layout if a browser surface is available, record final evidence, and commit on `stage`.

## Relevant Files

- `src/domains/cards/components/cards-library.tsx` — renders the Cards screen card list.
- `src/domains/cards/components/vocabulary-card-item.tsx` — individual card UI.
- `src/domains/cards/components/cards-dashboard.tsx` — connects dashboard delete behavior and readiness to the Cards list.
- `src/domains/cards/hooks/use-cards-dashboard.ts` — tracked personal card state and review-data persistence.
- `src/domains/cards/personal-card-removal.ts` — pure card/progress cleanup operation.
