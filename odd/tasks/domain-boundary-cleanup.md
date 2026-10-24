# domain-boundary-cleanup

## Objective
Remove cross-domain imports and make `src/lib` and `src/components` independent of `src/domains`, with no behavior change.

## Why
Project rules forbid it: `ddd-domain-structure.md:304-317` (no domain-to-domain imports) and `architecture-patterns.md:414-425` (lib/components -> domains FORBIDDEN, app -> domains allowed).

## Scope / authorized surface
`src/domains/{sync,auth,ai,settings,home,cards}`, `src/lib/{sync,auth,ai}`, `src/components/layout/connection-status.tsx`, `src/app/page.tsx`, `src/app/api/ai/*/route.ts`, `.claude/knowledge/architecture-patterns.md` (doc fix only).
Out of scope: forms (RHF+Zod), messages extraction, stores, Atomic Design layers, new dependencies.

## Constraints
- No behavior change; moves + import rewrites only (home summary is the one small extraction).
- English identifiers, no new files beyond moved/extracted ones.
- Advisory ~400 authored changed lines per task.
- Delivery: working tree is mostly untracked/uncommitted; no commits made without the user asking (deviation from ODD work-unit commits, to be confirmed).

## Tasks
- [x] T1 Sync contract: move `domains/sync/types.ts`, `use-connectivity-status.ts`, `validation.test.ts` -> `lib/sync/`; fix imports in lib/sync (5), settings-workspace, connection-status, login-workspace.
- [x] T2 Auth contract: move `domains/auth/types.ts` -> `lib/auth/types.ts`; fix imports.
- [x] T3 AI: move `lib/ai/server.ts` -> `domains/ai/server.ts` (update app/api routes); move `domains/ai/catalog.ts` -> `lib/ai/catalog.ts` (update settings + ai importers).
- [x] T4 Home: extract cards-derived computation from `home-dashboard.tsx` into a cards-owned pure function; `src/app/page.tsx` calls it and passes props; `HomeDashboard` stops importing cards.
- [x] T5 Docs: reconciled `architecture-patterns.md:180` with the forbidden rule. Optional eslint `no-restricted-imports` NOT done (not requested; would add config).

## Acceptance criteria
- `rg "@/domains/" src/lib src/components` returns nothing.
- `rg "@/domains/(\w+)" src/domains/<other>` shows no cross-domain edges.
- `npx tsc --noEmit`, `npm run lint` and `npx vitest run` pass (or failures pre-exist and are reported).

## Test policy
Pure moves: no RED step applicable; existing vitest tests are the safety net (7 files). Note: no `test` script and no vitest config exist; `@/` alias may not resolve in tests.

## Routes (per task)
T1-T3: delegated writer (2+ non-trivial files, import rewrites across many files). T4: same writer, sequential. T5: inline.

## Progress
T1-T3 done (moves + import rewrites, uncommitted). T4 done: cards owns `deriveCardsHomeSummary` (cards/home-summary.ts); home owns `HomeSummary` type + `deriveHomeDashboardData` and `HomeDashboard` takes `summary` prop; `src/app/home-dashboard-container.tsx` (client) reads the 4 storage keys and wires both; page.tsx renders the container. No home<->cards edge. Note: in domains/ai, catalog imports use relative `../../lib/ai/catalog` because the vitest run has no `@/` alias.

## Verification evidence
- `rg "@/domains/" src/lib src/components`: no matches
- cross-domain scan: only remaining edge is home -> cards (home-dashboard.tsx:4-22)
- `npx tsc --noEmit`: clean
- `npx eslint src`: clean
- `npx vitest run`: 7 files, 19 tests passed (after relative catalog import fix; alias unresolved in vitest)
- T4 re-verified after implementation: `rg @/domains/ src/lib src/components` none; no cross-domain edges in src/domains (only relative ../../lib/ai/catalog, which is lib); tsc clean; eslint clean; vitest 7 files, 19 tests passed.

## Next step
T5 (docs).
