# Step 1: Foundation and Home Shell

Build the responsive Next.js foundation and static Home dashboard from the attached Vokki Up visual proposal. This step establishes the visual tokens, reusable shell, and typed mock-data boundary without connecting production services.

## Problem and objective

The app still renders the generic Next starter. Replace it with the proposal's Spanish Home experience and responsive desktop, tablet, and mobile shell.

## Scope and constraints

- In scope: app shell, layout primitives, Home dashboard, visual tokens and light/dark styling, typed mock data, and App Router PWA manifest metadata.
- Out of scope: auth, Supabase, persistence, AI, SRS, CSV, sync, service worker, provider calls, Storybook, Docker, unrelated dependencies.
- The attached `Vokki Up — Propuesta visual.html` is the sole UI and design authority; preserve its Spanish user-facing copy.
- Do not commit or push.
- Forecast: about 700 authored lines across a single coherent foundation task. Delivery remains unmanaged here because the user explicitly prohibited commits and pushes.

## Route declaration

**Delegated direct — one bounded writer.** The task spans the app route, global theme, domain mock data, reusable shell components, and manifest. This crosses the multi-file writer trigger; parent provided the bounded edit surface and this single writer owns implementation.

## Acceptance criteria

- [x] Generic starter screen is replaced by a modular Home dashboard using typed static data.
- [x] Home contains next session, progress, streak, words/cards statistics, and today's activity, using proposal content and visual system.
- [x] Reusable header, responsive sidebar, and mobile bottom navigation match the proposal's shown shell states.
- [ ] Layout has been visually verified across desktop, tablet, and mobile without horizontal overflow; light/dark tokens are implemented.
- [x] App Router manifest is present for PWA readiness; no service worker is introduced.
- [x] No excluded integrations or unrelated dependencies are added.

## Verification

- `pnpm exec tsc --noEmit` — unavailable: local `node_modules` is absent and `tsc` is not installed.
- `pnpm lint` — unavailable: local `node_modules` is absent and `eslint` is not installed.
- `pnpm build` — unavailable: local `node_modules` is absent and `next` is not installed.
- Impeccable detector — returned `[]` for the changed UI targets.
- Static readback — responsive breakpoints, light/dark token sets, accessible navigation labels, typed mock Home data, and absence of service-worker wiring were inspected. A rendered screenshot/overflow pass remains pending until dependencies are available.

## Progress

- [x] Reviewed repository constraints, proposal structure, and existing starter screen.
- [x] Implemented typed Home mock data and componentized dashboard.
- [x] Implemented shared shell, responsive navigation, light/dark tokens, and manifest.
- [ ] Run functional checks and final viewport inspection after dependency setup.

## Next step

Make the repository's locked dependencies available, rerun the three requested commands, and inspect the rendered Home at desktop, tablet, and mobile widths before calling the task fully verified.