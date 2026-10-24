# Step 17: Real review metrics, theme, and responsive completion

## Objective
Replace unavailable Home metric placeholders with values derived from real card schedules and completed local review sessions, while completing dark-mode and tablet behavior across the aligned modules using existing design tokens.

## Problem and rationale
Home currently has deliberately unavailable mastery and weekly study duration, so static values or repetition-count guesses would misrepresent user activity. Review history stores ratings, but no session duration exists. The current scheduler is a simple interval heuristic and does not estimate recall probability. Theme support is token-based but several modules have only partial dark coverage, and tablet breakpoints differ by module.

## Scope
- Define a pure, documented mastery rule: a card is mastered when its schedule has at least 3 repetitions, last rating is `good` or `easy`, and its scheduled interval is at least 4 days. Evaluate current scheduler fields; do not hardcode metric values.
- Track completed review sessions locally with real start/end timestamps and derived elapsed minutes. Begin only on the first rating; close on review completion or explicit exit; prevent duplicate closure records.
- Derive “Estudiados esta semana” from completed sessions in the local calendar week and show zero when no sessions or qualifying minutes exist.
- Replace Home `null` markers with live mastered-card count and tracked weekly study minutes while preserving the exact proposal section structure and localized labels.
- Add deterministic pure tests for mastery classification, session duration, and weekly aggregation.
- Finish dark-mode legibility and tablet responsive behavior across Home, Notes, Cards, Writing, Settings, and shared shell; use current CSS tokens, correct overflow/focus, and avoid content or palette changes.

## Constraints
- Proposal HTML remains the visual contract; do not change module copy or structure except real metric values.
- Use local persistence only. No remote operations, secrets, Storybook, Docker, new dependencies, commits, or pushes.
- Keep scheduler math behind its existing interface; do not introduce FSRS or modify review scheduling behavior.
- Keep changes inside the authorized paths below.

## Authorized scope
- planning/tasks/step-17-metrics-theme-responsive.md
- src/domains/cards/**
- src/domains/home/**
- src/domains/notes/**
- src/domains/writing/**
- src/domains/settings/**
- src/components/**
- src/lib/storage/**
- src/app/globals.css

## Route declaration
Delegated-direct implementation with one writer after read-only mapping. Metric rules, local review-session tracking, Home integration, deterministic tests, and cross-module theme/tablet CSS are one coherent task because they share local activity data and the common token system.

## Acceptance criteria
- [ ] A pure `isMastered` rule documents and tests repetitions ≥3, final rating good/easy, and interval ≥4 days.
- [ ] Review session records contain a real start, end, and elapsed minutes; creation begins at first rating and occurs once when the session closes.
- [ ] Weekly minutes aggregate completed local sessions only and exclude sessions outside the current local week.
- [ ] Home uses actual scheduled-card mastery and tracked session duration, displaying zero when no qualifying data exists and retaining the proposal's exact structure.
- [ ] Home, Notes, Cards, Writing, Settings, and shared shell remain legible in light/dark modes and adapt at tablet widths without horizontal overflow or lost keyboard focus.
- [ ] Focused pure tests, `pnpm exec tsc --noEmit`, `pnpm lint`, `pnpm build`, and one final Impeccable detector pass are recorded exactly.

## Verification
- Focused Vitest tests for mastery and review-duration aggregation.
- `pnpm exec tsc --noEmit`
- `pnpm lint`
- `pnpm build`
- `C:\Users\maria\.agents\skills\impeccable\scripts\impeccable.cmd detect --json <changed UI targets>` once after final UI edits.

## Progress
- [x] Load Impeccable and repository constraints; inspect current scheduler, Home metrics, local persistence, and responsive/theme coverage.
- [x] Create this task document before source edits.
- [x] Implement tested mastery/session duration helpers and local persistence integration.
- [x] Wire Home metrics to real local records.
- [x] Add token-based dark and tablet coverage to all named modules.
- [x] Run requested checks and document limitations.

## Verification outcomes
- `pnpm exec vitest run src/domains/cards/scheduling/scheduler.test.ts src/domains/cards/scheduling/mastery.test.ts src/domains/cards/scheduling/review-sessions.test.ts` — passed, 3 files and 8 tests.
- `pnpm exec tsc --noEmit` — passed (exit 0).
- `pnpm lint` — passed (exit 0).
- `pnpm build` — passed (exit 0; Next.js 16.3.6 production build).
- Impeccable detector on `src/domains/home/components/home-dashboard.tsx`, `src/domains/cards/components/card-review.tsx`, and `src/app/globals.css` — returned `[]`.

## Limitations
- The in-app browser surface was unavailable, so rendered tablet/dark screenshots could not be inspected; CSS token and breakpoint behavior was checked structurally, with typecheck, lint, build, and detector passing.
- Older review events do not contain session boundaries and cannot be assigned retroactive durations; duration metrics begin accumulating from newly completed sessions.

## Known limitations
- The existing scheduler does not calculate mastery or probability of recall; the mastery rule above is explicit product policy for a derived count, not a claim made by the algorithm.
- Weekly history will begin accumulating after this change; older reviews have no timestamps for session boundaries and cannot be retroactively assigned real durations.
- Responsive/dark reference coverage is incomplete for some modules; extend existing tokens and responsive structure without inventing a new palette or module copy.

## Next step
Implement the pure metric/session rules first, then wire persistence and Home, followed by focused cross-module theme/tablet adjustments and the required verification.
