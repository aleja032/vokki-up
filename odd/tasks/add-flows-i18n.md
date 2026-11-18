# Add flows and language consistency

Branch `feat/ui-ux-batch`, worktree `vokki-up-ux`. Push only when the user asks.

## Objective

Make the add-cards flows clear and the language switch trustworthy: English mode must never show Spanish; manual card creation is hidden; mobile lists the creation modes separately like desktop; empty groups stop repeating the same CTA; the library is reachable from where cards are added.

## Constraints

- Impeccable craft-floor, atomic-design, tailwind-4, frontend-design for UI edits; Tailwind `@apply` + BEM, tokens only, `cn()`, mobile-first, no overflow at 390/1280.
- Domain: `cards` (plus `src/app/cards` composition and `src/lib/i18n`). No cross-domain imports.
- UI copy Spanish with English entries in `locale-extra-translations.ts`; identifiers English.
- ~400 authored changed lines per work unit is a planning heuristic only.

## Mapping (path:line)

- Add hub: `src/app/cards/cards-add-hub.tsx` (image, words, manual panels), `add-hub-mode-tabs.tsx`, `add-hub-modes.ts:1` (`ADD_HUB_MODES`, `DEFAULT_ADD_HUB_MODE='manual'`, `getSelectableHubModes`, `resolveHubMode` hard-code manual), `cards-add-hub.css:3-29` (below 761px header, tabs and non-manual panels are `hidden`, so mobile only gets the manual editor).
- Flags: `src/config/features.ts` (`writing`, `profileExtras`); no card-mode flag yet.
- Group detail: `group-detail.tsx:148-154` header "Añadir" always shown; `:157,176-185` empty state shows a second "Añadir tarjeta"; messages `messages.ts:116-119`; `onAddCard` -> `use-cards-dashboard.ts:113-119` `openEditor` (sets `editorGroupId`).
- i18n: `cards-dashboard.tsx:129-130` raw Spanish literals; 'Biblioteca de palabras' missing from `locale.ts` and `locale-extra-translations.ts` (also `word-library.tsx:39`); `site.ts:12` 'Biblioteca' unchecked; `message-coverage.test.ts` only covers messages files, not tsx literals or inline `createLocalizedMessages` blocks.

## Tasks

- [~] T1 i18n: no Spanish in English mode (fix the known offenders, audit cards, notes, home, settings, nav and shared components in the browser with English selected, add tests that cover inline message blocks). Partial: notes detail, delete dialogs and toasts not verified in browser.
- [x] T2 (revised) Manual stays a normal mode and the default. Image and Words are LOCKED (visible, aria-disabled, lock icon, explanation with links to Settings and the library) when `isAiEnabled` is false; `resolveHubMode` falls back to manual.
- [x] T3 (revised) Mobile lists the three modes (Image, Words, Manual) as tabs with the selected panel, like desktop.
- [x] T4 Group detail: hide the header "Añadir" when the group is empty; keep one CTA; add "Agregar desde la biblioteca" link (empty state and beside "Añadir" when cards exist); add hub opens with the group preselected.

## Decisions

- Library CTA: a clear button, not a step-by-step (recommended to the user; less friction, one tap to the library).

## Progress

Route: delegated direct (one writer, 2+ non-trivial files; explorer already mapped).

Observed (writer, uncommitted): vitest 61 files / 283 tests pass; tsc clean; eslint clean on touched dirs; prettier clean.
- RED seen: inline-messages-coverage (13 failures before fixes, then 2 more for generic-typed blocks) and group-detail (2 failures). add-hub-modes test was written with its implementation (no separate RED).
- Browser (Playwright own storage, English): 390 and 1280, no horizontal overflow (hub, group detail); mobile hub shows three tabs (64px high), tabs switch panels; group preselected in manual and image panes (Viajes, new empty group); empty group shows no header Add, one primary CTA plus library link (44px); group with cards shows Add and library link (44px); locked AI tabs: aria-disabled, lock icon, notice with Settings and library links, click focuses the notice; dark mobile hub looked correct.
- Fixed leaks: AppHeader server component froze the logo aria-label (now client), AiCaptureSteps module-level labels, word library strings, nav label, home captions, notes filters/categories, add hub title, group detail review label.
- Gaps: notes detail, delete confirm dialogs, toasts and the review screen revealed state not exercised in the browser; the settings Save did not persist the language in the Playwright browser (localStorage stayed Español, cookie switched), so English was set directly in storage; group names, seed notes and card meanings left Spanish on purpose; group-delete confirm in group-detail is still a stub (needs a delete handler, not a one-liner).

Unit 2 (observed, uncommitted):
- A language persistence. Reproduced with cleared Playwright storage: Save set cookie `vokki-locale=en` but `vokki-up:settings/language` stayed Español and reload reverted. Root cause: `saveChanges` (use-settings-preferences.ts) called `setLanguage` (state, persisted later by the effect in use-browser-state.ts:40-42) and then `setAppLanguage` synchronously; `setAppLanguage` makes `LocaleProvider` remount the whole tree (`key={language}`, locale-provider.tsx:46), discarding the pending state write. Fix: `commitAppLanguage` (src/lib/i18n/commit-app-language.ts) writes storage and cookie first, then calls `setAppLanguage`; test commit-app-language.test.ts (RED before). After the fix: storage/cookie/html lang English after Save, after reload, across /, /cards, /notes, /cards/word-library, and switching back to Español persists. Gap: the document title stays in the old language until the next reload (server metadata).
- B desktop group CTAs. All desktop group views open `GroupDetail` (tiles call `onOpenGroup`); `activeGroupId` is never set to a specific group (`setActiveGroupId` only receives ALL), so the library-filtered-by-group path in cards-library.tsx is currently unreachable. It was made consistent anyway (shared `GroupAddActions`, `onAddCard` prop): empty group without search/category filter gets the primary CTA plus library link, group with cards gets Añadir plus library link, filtered-empty keeps the filter message. cards-library.test.tsx covers it (RED before). Browser: empty group and group with cards at 1280 and 390, Español and English, light and (emulated prefers-color-scheme) dark: empty = Add card + library link (44px), with cards = library link + Add in the header (44px), no header Add when empty, no horizontal overflow. The library-filter variant is not reachable in the UI so it is verified by test only.
