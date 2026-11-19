# Home and cards redesign (proposal D)

Branch `feat/home-cards-design-d`, worktree `vokki-up-ux`. Push only when the user asks. No AI attribution in commits.

## Objective

Re-layout the home and the cards pages (Mi mazo) with design proposal D, without losing any current functionality.

Design source: Artifact `claude.ai/artifact/3a7006b7-7d22-4861-9760-c4398e2bae6f` (files `project/VokkiD*.dc.html`, saved copies in the session scratchpad).

## Constraints (user, non-negotiable)

- Componentize everything (Atomic Design; reuse `src/components` before creating).
- Colors only through semantic tokens, light and dark defined in one place, easy to change; no hex in components.
- Reuse everything; promote repeated pieces to shared.
- NO functionality loss: logic, hooks, containers, sync, i18n (es/en), themes, flags, existing tests stay green. If D omits something, keep it and place it in the new layout.
- Project rules: Tailwind `@apply` + BEM, no inline styles, `cn()`, English identifiers, text in messages with English entries, no cross-domain imports (compose in `src/app`).
- Dark theme: replace the global dark palette with D's navy (decision taken from the user's answer "Ajustar todo lo del home y tarjetas"; revisit if wrong).

## Mapping (explorer, path:line)

- Home composition `src/domains/home/components/home-dashboard.tsx:34-64`; container `src/app/home-dashboard-container.tsx:19-47`; summary type `home-summary.types.ts:4` (counts and weekly activity only).
- Tokens `src/app/globals.css:6-103`; fonts in `layout.tsx` (Fraunces, no Plus Jakarta Sans or Pixelify Sans).
- New data needed: due-cards hand (word, IPA, category, memory level, due date), weekly accuracy, unread favorite notes count, worlds progress.
- Assets Noma mascot and pixel world image live only as artifact blobs: user must export them; use neutral placeholders until then.

## Tasks

- [x] T1 Foundations: D palettes (light and dark) as semantic tokens, radii scale, urgency/mint/coral families, Plus Jakarta Sans + Pixelify Sans via next/font, motion keyframes with reduced-motion fallbacks.
- [x] T2 Shared atoms/molecules in `src/components`: progress bar (continuous and segmented), stat card, section heading, pixel label, pill; tests.
- [ ] T3 Data contracts in `src/app` container: due-cards hand, accuracy, notes count; keep existing summary fields.
- [ ] T4 Home layout: header streak pill, hero with CTA, due-cards hand, daily goal with chest, stats, week chart, today activity; mobile stacked + bottom nav FAB; every current action preserved.
- [ ] T5 Cards (Mi mazo) layout per `VokkiDMazo*`; all current actions preserved (groups, add hub, library, delete, manage, review).
- [ ] T6 Mundos: blocked until the user defines the domain (worlds vs groups).

## Acceptance

- Existing tests pass unchanged except marking changes reviewed one by one; tsc and eslint clean.
- Browser check at 390 and 1280, light and dark, es and en, no horizontal overflow.

## Progress

T1 (route: delegated direct, one writer; 3 files). Observed: vitest 74 files / 381 tests pass (new design-tokens test RED 32/32 then green), tsc clean, eslint and prettier clean (writer), parent spot check repeated vitest and tsc. New tokens: --track, --nav, --brand, --mint(-soft), --coral(-soft), urgency/hero/CTA fixed tokens, radius-d-* scale, --hover-lift, motion classes with own reduced-motion fallback, Tailwind `@theme inline` block. Fonts: Plus Jakarta Sans replaces DM Sans on --font-ui, Pixelify Sans on --font-pixel, Fraunces kept (11 uses). Dark palette is now D navy. Gap: `.csv-validation` keeps one hex outside the tokens (pre-existing).
