# Step 2: Cards

## Objective
Implement the Cards module from the supplied Vokki Up visual proposal, preserving that HTML as the UI source of truth.

## Problem and rationale
The application needs a usable vocabulary-card workflow spanning group overview, manual card creation, and review interactions. This step uses mock data and local client state only.

## Scope
- Cards overview, user-named groups, and card counts.
- Separate add-card and review-card entry points.
- Manual card fields: word/phrase, meaning, phonetics, example, part of speech, group, optional tags.
- Review card with pronunciation, translation reveal, example, and proposal-aligned rating controls.
- Reusable responsive components; no backend, auth, persistence, AI, FSRS, CSV, provider calls, Storybook, Docker, or unrelated dependencies.

## Constraints
- Keep the supplied HTML proposal as the visual source of truth.
- Use typed mock data and local client interactions.
- Do not edit the original Vite repository.
- Do not commit or push.

## Authorized scope
`planning/tasks/step-2-cards.md`, `src/app/cards/page.tsx`, `src/app/review/page.tsx`, `src/domains/cards/types.ts`, `src/domains/cards/data.ts`, `src/domains/cards/components/**`, `src/components/ui/**`, `src/app/globals.css`.

## Route declaration
Delegated direct. The feature crosses multiple non-trivial files and requires proposal/code reading before implementation.

## Acceptance criteria
- [x] Cards overview presents meaningful groups and correct counts.
- [x] Add and review have separate entry points and function locally.
- [x] Card form exposes all requested fields.
- [x] Review interactions reveal translation and allow rating/navigation.
- [x] Desktop, tablet, and mobile structures are styled with responsive layouts.
- [x] No integrations or persistence are introduced.

## Verification
- `pnpm exec tsc --noEmit` — passed (exit 0).
- `pnpm lint` — passed (exit 0).
- `pnpm build` — passed (exit 0); Next.js 16.3.6 generated `/cards` and `/review` routes.
- `git status --short --branch` — unavailable: Git reports “this operation must be run in a work tree.” No commit or push was attempted.

## Progress
- [x] Read repository instructions, required skills, and supplied proposal.
- [x] Inspect existing app structure and global design tokens.
- [x] Implement typed Cards data, groups, manual form, overview, and local review states.
- [x] Run all requested verification commands; exact outcomes recorded above.

## Next step
Continue the product plan with the next module; this step has no remaining implementation work.