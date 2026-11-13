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

## Authorized scope
CSS files under `src/` and the odd task doc. No TSX changes unless a class hook is truly missing (then report it first).

## Checks
`npx tsc --noEmit`, `pnpm lint`, `npx vitest run`, `pnpm build`; browser: hover each target group, confirm no layout shift and no hover on touch emulation.

## Progress
- T1 done (20e10ce): tokens --ease-out, --hover-duration, --hover-shadow, --lift-1/2 (zeroed under reduced motion), --hover-transition; logo rise.
- T2 done (6dc4d92): sidebar items, toggle, bottom nav, header avatar. Route: inline (CSS only, single writer).
- T3 done: buttons/links/tabs/chips across globals + domain CSS. Existing unguarded hover rules were removed and re-expressed inside @media (hover: hover). Tests RED/GREEN not applicable (CSS).
- T5 done: tsc, lint, vitest (218 pass), build OK; Playwright 1280/390 x light/dark: hover effects confirmed, no size shift, no transform under (hover: none).
- T4 done (9520ed0): clickable surfaces lift 2px (deck-group, group/open rows, deck-action, note-card, prefs-action/provider, activity rows on wide screens). Non-clickable (stat cards, deck-card, prefs-row, next-session card) intentionally static.
