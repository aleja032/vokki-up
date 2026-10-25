# Functional MVP surface

## Objective

Create a truthful MVP branch from the current `main`: keep working flows available, clearly mark unavailable capabilities as under construction, and replace the brand mark with the approved V/spark logo direction.

## Problem

The current main branch exposes seeded or mock content as if it were functional, and the approved logo direction has not been integrated consistently across the app shell, authentication screen, and favicon.

## Scope

- Preserve functional Home, manual Cards, Review, Notes, Auth, and Settings flows.
- Mark Writing AI feedback/results as under construction; keep local drafting and category selection usable.
- Add a reusable Vokki Up V/spark mark and favicon using the D1 direction.
- Keep responsive behavior and existing design tokens; do not redesign unrelated screens.

## Constraints

- Branch from the current `origin/main` commit.
- Do not include unrelated pre-existing worktree edits.
- Do not claim seeded/mock feedback or history as real user progress.
- Keep source artifacts in English unless existing UI copy is being extended through the localization catalog.

## Tasks

- [ ] MVP-01 Create clean functional-MVP branch from current main.
- [x] MVP-02 Integrate reusable D1 logo mark across shell/auth and favicon.
- [x] MVP-03 Mark Writing AI feedback as under construction and disable the unavailable CTA without disabling local drafting.
- [ ] MVP-04 Verify build, typecheck, lint, focused tests, and visual detector; record delivery commit.

## Acceptance criteria

- The branch starts from the exact current `origin/main` commit.
- Header, sidebar, auth brand, and favicon use the same V/spark mark.
- Writing draft/category selection remains usable and locally persisted.
- Writing AI analysis cannot be triggered and visibly states that it is under construction.
- Sample feedback is not presented as a completed user analysis.
- Existing functional modules remain reachable and unchanged outside this scope.

## Route

Delegated direct: the logo and Writing surface touch multiple non-trivial UI files; one writer should implement the bounded slice after this task record is created.

## Verification

- `pnpm exec tsc --noEmit`
- `pnpm lint`
- `pnpm exec vitest run src/lib/theme/theme-init-script.test.ts`
- `pnpm build`
- `C:\Users\maria\.agents\skills\impeccable\scripts\impeccable.cmd detect --json <changed UI targets>`

## Progress

- Branch created from `origin/main` at `a2e4fd1`.
- Task record created before source changes.
- MVP-02 and MVP-03 implementation completed; verification passed, with no commit created by this writer.

## Next Steps

Run the verification checks, then complete MVP-04 delivery work.
