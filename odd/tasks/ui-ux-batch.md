# UI/UX batch: cards, manage mode, modals, motion, leveled library

Branch `feat/ui-ux-batch` (from origin/main e355082), worktree `vokki-up-ux`. Local only: do NOT push without the user's approval.

## Objective

Make the cards and notes UI proportional and intuitive, replace inline delete confirmations with a blurred-backdrop modal, add motion between sections and cards, and give the library a level-based structure that motivates the learner.

## Constraints

- Impeccable + UI/UX skills for every UI edit (craft-floor, atomic-design, tailwind-4, frontend-design).
- Tailwind `@apply` + BEM CSS files, mobile-first PWA, tokens only (`--indigo`, `--surface`, `--line`, `--ink`), `cn()` for conditional classes.
- Hover only inside `(hover: hover)`, honor `prefers-reduced-motion`, no layout shift.
- QA: no horizontal overflow at 390px and 1280px, light and dark; no extra scrollbars; no dead space (see `odd/tasks/cards-library-controls.md`, `odd/tasks/hover-polish.md`).
- No cross-domain imports; shared UI lives in `src/components`; UI copy Spanish (+ English entry in `locale-extra-translations.ts`), identifiers English.
- ~400 authored changed lines per work unit is only a planning heuristic.

## Findings from mapping (path:line)

- Card layout: `src/domains/cards/components/vocabulary-card-item.tsx:44-94`, `cards.css:700-733` (title `line-clamp-2`, no reserved height, footer not pinned).
- Manage: `cards-library.tsx:105-131`, checkbox only (`vocabulary-card-item.tsx:67-77`), whole card not clickable, no icon, no cancel; delete is inline `.deck-confirm` (`cards.css:1370`).
- Notes delete: inline alertdialog `notes/components/note-detail.tsx:92-118`.
- No modal primitive exists. Group delete confirm is a stub (`group-detail.tsx:91-115`, confirm only dismisses).
- Library "already added" is derived live from cards (`word-library.tsx:112`), so deleting a card re-enables its entry; "Todas" already lists the whole catalog (`catalog.ts:895,912`).
- No section/route transitions; card swaps are instant. Reduced-motion rule at `globals.css:284`.
- No Spanish example or level field on `VocabularyCard` / `WordLibraryEntry`; catalog is pipe-split seed strings (`catalog.ts:23-34`).
- Shortcut copy: `shortcutLabel`, `spaceKey`, `keyHint` in `cards/messages.ts:192-197`, rendered at `review-card-screen.tsx:330`.
- "Nueva tarjeta" on home: `home/components/home-dashboard.tsx:41,70`.

## Work units and tasks

- [x] U1 (commit 6cf5702; group-screen delete NOT done, see Progress; native review pending) Shared modal + manage redesign: new `src/components` modal (focus trap, Esc, scroll lock, blur backdrop); cards delete and note delete use it; manage mode gets icon, cancel, whole-card selection, single/multi delete (also inside a group).
- [ ] U2 Card proportions + motion: equal-height aligned cards (reserve title lines, pinned footer); section and card enter transitions with reduced-motion fallback.
- [ ] U3 Small UI: remove shortcut hint copy, remove "Nueva tarjeta" from home, optional Spanish example with eyebrow (needs `exampleEs`).
- [ ] U4 QA sweep: scrollbars, dead space, overflow at 390/1280 light+dark (browser-verified).
- [ ] U5 Library: confirm deleted card re-enables its entry (test), clarify "Todas" scope.
- [ ] U6 Leveled library + progression/engagement: needs domain decision and research first (levels basic/intermediate/advanced, categories inside, rewards, mascot, richer stats).

## Open decisions

- U6: research done. Proposed default: library levels (Básico/Intermedio/Avanzado) + level-up moment + two stats tiles (mastered per level, 7-day due forecast); mascot later; lives in the `cards` domain; labels without "CEFR"; levels assigned by the assistant and reviewed by the user. Awaiting the user's confirmation.
- U3: Spanish examples: new file mapping catalog entry id to `exampleEs` (about 800 entries), looked up by normalized term so already-saved cards also show it; optional in review with an eyebrow "Ejemplo en español". Custom/AI cards get none for now.
- U1b (new): card manage/delete on the mobile group screen (`group-detail.tsx`) and its stub group-delete confirm.
- U5/"Todas": confirm the user means the card library filter vs. the word library.

## Progress

Route per unit: delegated direct (writer), 2+ non-trivial files each.
U1 (writer, uncommitted in worktree):
- Added `src/components/overlay/confirm-dialog.{tsx,css,test.tsx}` (native dialog, blurred backdrop, scroll lock via `html:has(.confirm-dialog[open])`, Cancelar focused first, Escape and backdrop click cancel, reduced-motion safe).
- Cards manage mode: ListChecks icon on "Gestionar"; whole card is an overlay `role="checkbox"` button with check badge and indigo ring; floating action bar (count, Seleccionar todas / Quitar selección, Cancelar, Eliminar) in a zero-height sticky dock above the bottom nav; delete uses the shared modal, confirm calls `onDeleteCards` and exits manage mode. Notes delete uses the same modal. New English string: "Quitar selección".
- Observed: vitest 57 files / 257 tests passed; `tsc --noEmit` clean; eslint clean; prettier (`--end-of-line auto`) clean except `notes.css`, which had the same pre-existing tailwind class-order diffs at HEAD. RED observed for the card checkbox test; the dialog test was written after the component (no RED).
- Browser (Playwright, 390 and 1280, light and dark): entering manage mode, selecting and opening the modal caused zero card/grid/heading shift; no horizontal overflow; blurred backdrop visible; focus on Cancelar; Escape and backdrop click close; Cancelar exits manage mode; confirm deletes and exits. Note delete modal verified at 1280 dark only (the mobile notes list did not open the detail view in the test).
- Commit 6cf5702 (`feat(ui): add a shared confirm dialog and redesign card manage mode`); parent spot check re-ran vitest (257 passed) and `tsc --noEmit` (clean).
- Native review: assessed medium (714 lines, `slice_budget_reached`), user granted consent for this candidate (lineage `review-432e571f7f3e5e46`). The reviewer capture could not run: the `claude` executable is not on PATH in this environment. Review is unavailable/pending, not passed. Delivery stays a user decision.
- Not done / gaps: the group screen (`group-detail.tsx`, mobile group view) has no card manage/delete and was outside the allowed edit surface; select-all covers every card in the current filter, not only the visible page; first-round bug (missing `@reference 'tailwindcss'` in the new CSS) was fixed.
