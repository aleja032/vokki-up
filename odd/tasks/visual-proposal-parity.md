# visual-proposal-parity

## Objective
Make the UI match `Vokki Up — Propuesta visual.html` on desktop, tablet and mobile, including error/offline/empty states. AI flow screens are STATIC MOCKUPS only (layout, no functionality).

## Why
Gap analysis (read-only explorer) found tokens already match; gaps are shell layout, missing error screens, offline page, voseo copy, card validation states, and the AI flow screens.

## Scope / authorized surface
Phase A: `src/components/layout/**`, `src/app/{not-found,error,global-error,loading}.tsx`, CSS for shell/error pages, `public/offline.html`, `src/config/messages.ts`, copy-only edits in `src/domains/**` (voseo -> tú).
Phase B: card validation states, static AI screens, group management + settings parity (details to be fixed when Phase B starts).
Out of scope: any AI functionality (upload, OCR, API calls, retries, offline queue), `/login` and `/import-export` restyle, service worker caching changes.

## Decisions (made by the agent, user may revert)
- Follow the proposal literally on desktop: no top header; sync pill + avatar inside the sidebar; Ajustes as a main nav item; sidebar 240px expanded / 92px collapsed.
- Tablet has no artboard in the proposal: use the collapsed 92px rail.
- Mobile: 76px bottom nav with 4 items, header with brand + "Sin conexión" pill + avatar (as in the proposal).
- States the proposal does not design (generic 500, global error, loading skeleton) reuse the 404 layout and existing tokens.
- Copy in tú (proposal) instead of voseo.
- Global shared texts go in `src/config/messages.ts` (no new "errors" domain).
- User confirmed: AI flow = static layout only.

## Tasks
### Phase A
- [x] V1 Unpack the proposal (bundler HTML, gzip manifest, 29 pages) into scratchpad per-page HTML for reference.
- [x] V2 Shell parity (desktop/tablet/mobile) in `src/components/layout/**` + CSS.
- [x] V2b Home content parity (src/domains/home/**, home-dashboard.css; mobile: next session + weekly overview + activity; desktop: goal, stats, week chart).
- [x] V3 `not-found.tsx` (mobile + desktop, static search UI), `error.tsx`, `global-error.tsx`, `loading.tsx` skeleton.
- [x] V4 Restyle `public/offline.html` with tokens/fonts, copy in tú.
- [x] V5 Voseo -> tú copy across the app.
### Phase B (one writer per module, sequential; user: "update the other modules to match the proposal exactly"; AI = static layout only)
Per-module rules: compare against the unpacked proposal markup (scratchpad `proposal\page-NN.tpl.html`) at 1440 / 768 / 390, light + dark; styles in component-scoped CSS with `@apply` (+ `@reference`), cards/notes/etc. rules removed from `globals.css` once re-homed; no behavior change except the listed validation states.
- [x] V6 Cards module: `/cards` overview + filters + empty states, group list/detail (rename/color/delete confirmation as STATIC UI, no data mutation), new group form (counter n/30), manual card editor (validation summary "Revisa N campos", per-field errors, duplicate-word error with link, 160-char example counter, disabled save style) with RHF + Zod.
- [ ] V7 Review module (`/review`): mobile + desktop, rating chips, offline notice.
- [ ] V8 Writing module (`/writing`): mobile + desktop, AI feedback panel (static feedback states).
- [ ] V10 Notes module (`/notes`): mobile + desktop, empty states ("Ninguna nota coincide con tu búsqueda.").
- [ ] V11 Settings module (`/settings`): mobile + desktop, AI provider tab static (connection test states as static UI), profile, "Cómo funciona"; Noto Sans for IPA.
- [ ] V12 AI flow static screens (add, processing, review proposals, created) + 3 AI error screens (offline, image without words, service error) + offline-queued state. No functionality: the "Con IA" entry only navigates to / reveals the mockups.
### Cross-cutting
- [x] V15 Prune dead rules from globals.css
- [ ] V14 Overflow hardening (user: "toda la UI debe ser adaptativa; qué pasa con textos muy largos para que no se desborden"): stress the whole UI with long content (very long group/card/note names, unbroken strings, URLs, long email, long tags, large numbers, long Spanish copy) at 320/360/390/768/1440 in light and dark; no horizontal page scroll, no text spilling out of its container or under fixed bars, no broken layouts. Policy: titles/names wrap up to 2 lines then ellipsis (line-clamp); single-line controls (chips, pills, buttons, tabs, nav labels) truncate with ellipsis and keep a `title`; unbroken strings use `overflow-wrap:anywhere`; flex/grid children get `min-w-0`; inputs/textareas keep their own scroll. No visual change at normal lengths: proven by a before/after computed-style diff with normal data. Runs AFTER V12 (AI screens) and L4 (guest/auth header) and the globals.css prune, to avoid concurrent edits.
- [x] V9 Convert new CSS (`home-dashboard.css`, `app-shell.css`, `error-pages.css`) to Tailwind `@apply` for layout/spacing/typography/colors per `.claude/rules/styling.md`; keep theme variables, `@media` and complex selectors as CSS. No visual change: verified by before/after computed-style diff at 3 viewports x 2 themes.

## Acceptance criteria
- `npx tsc --noEmit`, `npx eslint src`, `npx vitest run` pass.
- Each new/changed screen compared with the proposal markup/screenshots at 1440x900, 768x1024, 390x844 via agent-browser; differences listed honestly.
- No hydration/console errors on the touched routes.
- Copy verbatim from the proposal for the screens it defines.

## Test policy
UI layout: no RED step applicable (no component test infra). Verify with tsc/eslint/vitest + agent-browser screenshots; report anything not verified.

## Routes (per task)
Delegated single writer per phase, sequential. Trigger: Writer trigger (2+ non-trivial files).

## Progress
V6 done (cards module, see Verification evidence). Phase A done (V1-V5 + V2b). Shell CSS lives in src/components/layout/app-shell.css; home CSS in src/domains/home/components/home-dashboard.css; shell/home rules removed from globals.css.

## Verification evidence
V9: home/shell/error CSS converted to @apply (home 0->109, shell 35->50, error 17->37). Computed-style diff baseline vs after: 7362 elements / 640494 props over / /cards /notes /settings 404 x 3 viewports x 2 themes: only 2 justified diffs (transition list "0.16s, 0.16s" -> "0.16s" and align-items end -> flex-end on a grid). Skeleton and status-screen rules checked by injected markup (values match). tsc 0, eslint 0, vitest 34 passed. Kept plain: custom-property blocks, @media structure (760/761/1100), keyframes/animation, transforms (rotate utility uses the rotate property), calc min-height, border:0 resets, font: inherit, reduced-motion overrides.
tsc --noEmit: exit 0. eslint src: exit 0. vitest run: 10 files / 34 tests passed. agent-browser (session va-writer) screenshots at 1440x900, 768x1024, 390x844 for /, /cards, /notes, /settings, 404, /offline.html (dark) plus home light and forced error boundary in scratchpad visual-after/. No console errors or page errors. global-error.tsx NOT exercised.

V6 (cards): route delegated writer. TDD: card-create.schema.test.ts (+example max 160, +createCardCreateSchema duplicate rule, RED observed then GREEN) and card-learning-state.test.ts (RED observed then GREEN). tsc 0, eslint 0, vitest 11 files / 44 tests passed. CSS: src/domains/cards/components/cards.css (@apply); 268 cards rules removed from globals.css (src/app/globals.css 4846 -> ~3480 lines; shared .primary-action/.secondary-action/.section-heading/.eyebrow/.cards-back and review rules kept). Other routes (/ /notes /settings /review /writing /import-export x 3 viewports x 2 themes) computed-style diff before vs after: 7782 elements / 677034 props, 0 diffs. agent-browser compared the app with proposal pages 04/05/11/23/26/27 at 430 (mobile), 768 and 1440 (scratchpad visual-cards/proposal-* vs app-*; dark has no proposal artboard). Smoke test with real keystrokes: create group (localStorage groups 4->5, sync queue +1), create card (library 12->13, queue +1), required/duplicate/160-char errors + summary, view existing link, group menu/confirmation (static); no console or page errors.

V15 (prune globals.css): script-driven (postcss, data-driven by class usage in src .ts/.tsx plus selector refs in other CSS files). globals.css 3485 -> 708 lines, 72094 -> 13371 bytes (603 -> 99 rules); app-shell.css 277 -> 274 lines (removed dead .writing-heading/.settings-heading h1 block). Selectors removed by family: writing 181, settings 151, notes 109, review 77, note 27, limit-control 11, theme-picker/option 9, reveal-action 2, cards-proposal-review 1; 12 emptied at-rules dropped; kept .cards-back (import-export), .primary-action, .secondary-action, .section-heading, .eyebrow, .card-surface, .progress-ring*, portability-*/csv-* (import-export). Computed-style diff baseline vs after (both captured with the same app state, 13 routes x 3 viewports x light/dark): 78 captures, 15396 elements, 1016136 properties, 0 differences. 44 interactive screenshots (cards group detail/new group/new card, note detail/new note, review back, settings profile and AI untested/testing/error, writing feedback; 1440 and 390, light and dark): 39 byte-identical, 5 differ only because the saved settings theme re-applied light in the baseline run (visual check: same layout). Console clean. tsc exit 0, eslint src exit 0, vitest 16 files / 59 tests passed. Defined-nowhere classes (informational): aicap-footer__main, aicap-form (from in-progress ai-capture-workflow.tsx of another feature).

## Next step
Phase B continues with V7 (review module).
