# Step 12: Align Notes with Proposal States

## Objective
Align the Notes module with the supplied Vokki Up HTML contract across desktop, mobile light, and mobile dark, while preserving locally managed notes and a separate create/edit flow.

## Problem and rationale
The current Notes route presents a sidebar and editor together, which does not match the supplied mobile list state. The earlier visual deviation happened because functionality was implemented before each responsive state was extracted from the proposal. This task reverses that order: extract and compare every supplied state first, then implement the UI.

## Scope
- Inspect bundle `d61a594b-eae4-4b3b-9417-aa9d4c5b436d` (`Vokki Up — Notas`) and related desktop Notes states before coding.
- Match the proposal's header, search, category/favorites pills, note cards, empty state, New Note action, and active Notes navigation.
- Keep note creation/editing in a separate editor state with explicit return navigation, without changing the list presentation.
- Preserve real local notes, favorite state, category, updated date, responsive behavior, accessibility, and existing theme tokens.

## Constraints
- Treat the HTML proposal as the visual source of truth; do not invent copy or imagery.
- Keep Notes components reusable and data local.
- Do not change unrelated modules, make remote calls, add secrets, Storybook, or Docker, or commit/push.

## Authorized scope
`planning/tasks/step-12-notes-proposal-alignment.md`, `src/domains/notes/**`, `src/app/notes/**`, `src/app/globals.css`, `src/components/**`.

## Route declaration
Delegated direct, single writer: exact proposal extraction and a multi-file UI/data flow correction are needed. Before edits, inspect the linked proposal states, current Notes data/state and shell behavior, then apply changes only within the authorized surfaces.

## Acceptance criteria
- The Notes list matches proposal structure, copy, spacing, responsive behavior, and mobile bottom navigation; no embedded editor/sidebar appears in the list state.
- Filters include `Todas`, `Favoritas`, `Gramática`, `Expresiones`, and `Cultura`; list cards show title, preview, favorite, type, and date.
- Empty results reproduce the proposal's exact copy and layout.
- Users can create, view, edit, save, toggle favorite, and return to the list without losing existing notes or sync-tracked local mutations.
- Light and dark themes use existing tokens and remain readable and accessible.
- No unrelated module, remote behavior, or dependency is introduced.

## Verification
- `pnpm exec tsc --noEmit`
- `pnpm lint`
- `pnpm build`
- Run the Impeccable mechanical detector once after edits: `C:\Users\maria\.agents\skills\impeccable\scripts\impeccable.cmd detect --json <changed targets>`.

## Progress
- [x] Read the Impeccable skill and run `impeccable context`.
- [x] Extract the linked Notes document and inspect its mobile light structure and exact provided copy.
- [x] Identify related desktop and dark Notes proposal states and map filters, card data, empty state, favorites, and navigation. The bundle contains mobile light and desktop Notes states but no Notes dark-state artifact; dark styling reuses existing theme tokens.
- [x] Inspect Notes persistence/sync and responsive theme styles. `useTrackedBrowserState` remains the collection boundary; favorite is optional so existing stored notes remain valid.
- [x] Implement proposal-aligned list/detail desktop and separate mobile create/edit state with return navigation.
- [x] Run all requested checks and the one detector pass; record exact outcomes.

## Progress evidence
- Mobile light markup specifies the exact subtitle, search placeholder, five filter pills, note-card hierarchy, empty copy, floating New Note button, and active Notes bottom-navigation style.
- Desktop Notes markup uses the same search/filter/card structure with a selected-note detail panel and an inline New Note action.
- Current app notes differ from HTML fixture examples; existing local note titles and dates were preserved rather than replaced with proposal sample data.
- The list supports search, the requested filters, favorite toggling, desktop detail selection, mobile editor navigation, and local saving through the existing sync-tracked state adapter.

## Verification results
- `pnpm exec tsc --noEmit` — passed (exit 0).
- `pnpm lint` — passed (exit 0).
- `pnpm build` — passed (exit 0); Next.js generated `/notes` and all existing app routes.
- Impeccable detector (single run) — passed with `[]` for the changed targets.
- Proposal limitation: the bundled HTML has mobile-light and desktop Notes pages, but no dark Notes screen. Existing dark tokens are applied; exact dark-state comparison was unavailable. The proposal fixture titles/dates also differ from current local notes, so local note content was preserved.

## Next step
Proceed to the next user-authorized product task; retain the supplied Notes HTML as the sole visual contract.
