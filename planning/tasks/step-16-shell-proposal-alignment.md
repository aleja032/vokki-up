# Step 16: Shared AppShell proposal alignment

## Objective
Align the shared desktop and mobile AppShell, navigation, header, and connection-state presentation with the supplied HTML proposal while preserving all existing routes, active-route behavior, accessibility, and truthful local connectivity state.

## Problem and rationale
The shared shell currently exposed a fabricated account initial and an “En línea” label that was not present in the visual proposal. The proposal has desktop and mobile shell variants, but does not provide every device/theme combination. Extracting the shared shell states before editing keeps the proposal as the visual contract and avoids compounding past module-level mismatches.

## Scope
- Align desktop sidebar, shared header, mobile header, bottom navigation, active state, spacing, and responsive shell rules to the proposal.
- Keep existing route destinations and ensure Settings, Cards/review, Notes, and Writing active states remain accessible.
- Represent connection status only with state supported by the existing local connectivity boundary; do not imply remote synchronization.
- Replace the fabricated avatar initial with a neutral profile icon; do not add copy absent from the reference.
- Preserve dark mode tokens and apply them to shared shell states without claiming an unavailable dark desktop reference.

## Constraints
- The supplied HTML is the sole visual source of truth.
- No remote operations, secrets, Storybook, Docker, unrelated dependencies, commits, or pushes.
- Do not change module content or business behavior outside the shared shell.
- All changes remain within the authorized surfaces below.

## Authorized scope
- planning/tasks/step-16-shell-proposal-alignment.md
- src/components/layout/**
- src/components/**
- src/app/globals.css
- src/app/layout.tsx

## Route declaration
Shared AppShell refinement: desktop navigation, mobile navigation, status presentation, and responsive layout are one coherent shell task; module routes and module content remain unchanged.

## Acceptance criteria
- [x] Desktop uses the proposal's brand, sidebar navigation, and header treatment without inventing a user identity or labels.
- [x] Mobile uses the compact brand/status header and four-item bottom navigation with correct active state and safe-area spacing.
- [x] Status wording reflects known browser connectivity/local state and does not claim a remote sync state.
- [x] Shell controls retain accessible names, visible focus, semantic navigation, and aria-current behavior across nested routes, including Settings.
- [x] Existing light/dark theme tokens continue to work; unavailable reference variants are documented rather than inferred as verified.
- [x] TypeScript, lint, production build, and Impeccable detector checks completed successfully.

## Verification
- `pnpm exec tsc --noEmit` — exit 0.
- `pnpm lint` — exit 0 (`eslint src`).
- `pnpm build` — exit 0; production build generated configured app routes.
- Impeccable detector: `detect --json src/components/layout/app-header.tsx src/components/layout/app-sidebar.tsx src/components/layout/connection-status.tsx src/app/globals.css` — exit 0, output `[]` (one final pass).
- Delegated check attempt could not change into the repository due `EPERM`; checks were then run directly with explicit workspace authorization and all three succeeded.

## Progress
- [x] Load Impeccable instructions and map the proposal/current shell before source changes.
- [x] Create this task document before editing source.
- [x] Align shared shell structure, responsive spacing, navigation active states, and truthful local connection state.
- [x] Run all requested checks and record unavailable states.

## Reference limitations
- Proposal contains desktop light, mobile light, and mobile dark Home shell samples; no dark desktop, tablet, or mobile sidebar sample is available.
- The light proposal shows avatar initial K but does not establish a real profile identity; the implementation uses a neutral profile icon instead of inventing one.
- “Al día” and other sync labels are examples in design-system states, not proof of live remote sync. The existing boundary reports browser connectivity only, so online now displays the proposal's local-storage status “Guardado en el dispositivo,” and offline displays “Sin conexión.”

## Next step
Step 16 shared-shell alignment is complete; proceed to the next requested product task.
