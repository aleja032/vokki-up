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
- [ ] T1 Shared hover tokens and base behavior in `globals.css` (+ `vokki-logo.css` logo rise).
- [ ] T2 Shell: sidebar nav items, bottom navigation, header actions, brand link (`app-shell.css`).
- [ ] T3 Buttons and links across domains: primary, secondary, icon buttons, tabs, chips.
- [ ] T4 Surfaces: home dashboard cards, cards/groups list rows, notes list, settings rows, AI panes, login.
- [ ] T5 Verify: tsc, lint, tests, build; browser check desktop 1280 + mobile 390, light + dark.

## Authorized scope
CSS files under `src/` and the odd task doc. No TSX changes unless a class hook is truly missing (then report it first).

## Checks
`npx tsc --noEmit`, `pnpm lint`, `npx vitest run`, `pnpm build`; browser: hover each target group, confirm no layout shift and no hover on touch emulation.

## Progress
- Created. Nothing implemented yet.
