# Hover polish

Repo: `vokki-up-clean` worktree `../vokki-up-hover`, branch `feat/hover-polish` (from origin/main a423e15).
Push and merge stay a user decision.

## Objective
Every interactive element responds to hover with a small, consistent, tasteful state change, so the app feels alive on desktop without hurting mobile.

## Motion thesis (Operate mode: feedback, not decoration)
- Feedback: controls acknowledge the pointer in 150ms with an exponential ease-out.
- Hierarchy: primary actions darken/lift, surfaces (cards, rows) lift 2px and pick up an indigo-tinted border and a soft offset shadow, nav items tint with indigo-soft.
- Focal moment: the logo mark. On hover the whole mark rises 2px (the "Up").
- Budget: transform, opacity, color, border-color, box-shadow only. No layout-driving properties.

## Constraints
- Every hover rule lives inside `@media (hover: hover)` so touch devices never get sticky hover.
- No layout shift. Reuse tokens (`--indigo`, `--indigo-strong`, `--indigo-soft`, `--surface`, `--line`, `--ink`); add shared `--ease-out` and `--hover-shadow` tokens to `globals.css`.
- Keep the existing global `prefers-reduced-motion` rule; also drop transforms under reduced motion.
- Tailwind `@apply` and BEM CSS files, no inline styles, no new dependencies.
- Dark theme must stay legible (tokens already flip per theme).

## Tasks
- [x] T1 (20e10ce) Shared hover tokens and base behavior in `globals.css` (+ `vokki-logo.css` logo rise).
- [x] T2 (6dc4d92) Shell: sidebar nav items, bottom navigation, header actions, brand link (`app-shell.css`).
- [x] T3 (afb47c8) Buttons and links across domains: primary, secondary, icon buttons, tabs, chips.
- [x] T4 Surfaces: home dashboard cards, cards/groups list rows, notes list, settings rows, AI panes, login.
- [x] T5 Verify: tsc, lint, tests, build; browser check desktop 1280 + mobile 390, light + dark.

## Phase 2: animations (user request: "less flat, more interactive")
Intensity split chosen by the user: SUBTLE on utility surfaces, MEDIUM on Home and the card review flow.
- Subtle (nav, buttons, lists, Notes, Settings, forms): press feedback (`:active` scale ~0.98), sliding tab indicator, smooth state transitions. No entrances.
- Medium (Home + review): short capped stagger-in of dashboard cards on first paint, progress ring fill, count-up numbers, 3D flip of the review card on reveal, a brief completion moment at review end.
- One authored moment per surface, no identical entrance everywhere. All motion has a `prefers-reduced-motion` path (no movement, keep state change/opacity).
- [x] T6 (386b1c0) Subtle layer: press feedback, tab indicator slide, small state transitions (CSS).
- [x] T7 (59973c9) Home medium: stagger-in, ring fill, count-up (CSS + minimal TSX).
- [x] T8 (12dc2b0) Review medium: card flip on reveal and completion moment (CSS + minimal TSX).
- [x] T9 Verify: tsc, lint, vitest, build; browser pass at 1280/390 light + dark, reduced-motion emulation.

## Authorized scope
CSS files under `src/` and the odd task doc. Phase 2 also authorizes minimal TSX changes in Home dashboard and review components only (class hooks, a count-up hook, state for flip/completion). No new dependencies.

## Checks
`npx tsc --noEmit`, `pnpm lint`, `npx vitest run`, `pnpm build`; browser: hover each target group, confirm no layout shift and no hover on touch emulation.

## Progress
- T1 done (20e10ce): tokens --ease-out, --hover-duration, --hover-shadow, --lift-1/2 (zeroed under reduced motion), --hover-transition; logo rise.
- T2 done (6dc4d92): sidebar items, toggle, bottom nav, header avatar. Route: inline (CSS only, single writer).
- T3 done: buttons/links/tabs/chips across globals + domain CSS. Existing unguarded hover rules were removed and re-expressed inside @media (hover: hover). Tests RED/GREEN not applicable (CSS).
- T5 done: tsc, lint, vitest (218 pass), build OK; Playwright 1280/390 x light/dark: hover effects confirmed, no size shift, no transform under (hover: none).
- T4 done (9520ed0): clickable surfaces lift 2px (deck-group, group/open rows, deck-action, note-card, prefs-action/provider, activity rows on wide screens). Non-clickable (stat cards, deck-card, prefs-row, next-session card) intentionally static.

- T6 done (386b1c0): press feedback via the individual `scale` property (composes with hover `transform` lifts; token --press-scale 0.98, 0.99 on large surfaces, 1 under reduced motion; `scale` added to --hover-transition), input/textarea/select focus border + color transitions, settings switch knob now translates instead of flipping justify. Tab indicator: tabs/nav already cross-fade background/color; a true sliding indicator needs JS or item-count-specific selectors, so the cross-fade fallback was kept. Tests RED/GREEN not applicable (CSS).
- T7 done (59973c9): Home stagger-in (home-rise, delays 0-400ms, once per mount), ring fill via keyframe from stroke-dasharray 0 (700ms, 250ms delay), count-up via src/lib/motion/use-count-up.ts. computeCountUpValue test written first: RED observed (module missing), then GREEN (6 tests).
- T8 done (12dc2b0): review card reveal swings in with perspective rotateY (450ms, from edge-on; the front face is not rendered separately because reveal logic and tests are unchanged, so it is a half-flip), completion badge pop + soft ring pulse (600/800ms). Reduced motion: opacity fade only.
- T9 done: tsc OK, lint OK, vitest 224 pass (218 + 6 new), build OK. Browser (Playwright, dev server, guest mode with localStorage-seeded cards): keyframes sampled by pausing animations and setting currentTime (headless rAF/frame clock starves live sampling): ring 0px -> 12px@300ms -> 32px final, stat cards opacity 0 -> 1 staggered, flip matrix3d rotateY -> none, completion pop scale 0.6 -> 1.08 -> 1 and ring pulse opacity 0.55 -> 0. Reduced motion: only home-fade / drill-card-fade animations, card transform none, press scale 1. Press scale 0.98 confirmed once the transition finished. No horizontal overflow at 390 or 1280, light and dark. Not verified live: intermediate count-up frames (rAF starved in headless; only start 0 and final value observed), settings switch knob (not rendered in this build/guest state), visual screenshots.

## Contrast audit

Method: every :hover rule in the shipped stylesheets was matched against live elements (guest mode, routes /, /cards, /cards/add, /notes, /settings, /login, /review, /import-export), :hover and :hover+:active forced via CDP, 2 rAF + 250ms settle, text/icon colors composited over the ancestor background, WCAG ratio computed. Viewports 1280x800 and 390x844, light and dark. Elements not rendered in guest mode were checked statically from tokens.

Failures found and fixed (globals.css):
- .primary-action (base and :hover) hardcoded #ffffff: dark 2.12:1 on --indigo-strong (and ~2.7:1 on --indigo) -> new theme-aware --on-indigo token (#fff light, #141416 dark): 9.69 light, 8.68 dark.
- --red-ink in the forced dark theme block was #7d280c (the prefers-color-scheme block had #f09a7e): 1.40:1 on --red-soft, hit every red-soft hover (prefs-remove, aicap reject/discard, deck menu danger, note type chip) -> #f09a7e: 6.18:1.

Minimum ratios after the fix (hover and hover+active, both themes): text >= 4.82 (indigo on indigo-soft, dark) and >= 5.30 elsewhere; on-indigo on indigo-strong 8.68 dark / 9.69 light; red-ink on red-soft 5.30 light / 6.18 dark; aicap danger button 5.02 light / 5.81 dark (no color change on hover).
Known, not hover-related and not changed: amber favorite star icon 2.95:1 on white (light, base state equals hover; threshold 3:1 for icons).
Not rendered in guest mode (static computation only): aicap-*, aipane-*, deck editor/confirm/menu, prefs-* rows, drill rating/done.
