# Step 19: Mobile Cards action cards

## Objective
Match the Cards mobile action row to the proposal: “Nueva tarjeta” and “Repasar” appear as two vertical action cards side by side instead of full-width stacked buttons.

## Scope
- Change only the Cards overview action markup and responsive styling.
- At mobile widths use a two-column grid with a 12px gap and vertical action-card contents.
- Match specified mobile padding, radius, icon sizes/surfaces, title, and subtitle hierarchy using existing theme tokens.
- Preserve desktop action behavior and proportions, keep the Step 18 horizontal groups scroller intact, and prevent page-level horizontal overflow.
- Keep visible focus, accessible button/link behavior, and the current copy.

## Acceptance criteria
- [x] Mobile action CTA cards display side by side in a two-column grid with 12px gap.
- [x] New Card and Review surfaces/icons/text hierarchy match the specified proposal state.
- [x] Desktop action styling remains coherent and is not forced into the mobile card layout.
- [x] The existing horizontal Groups scroller remains unaffected and the page has no added overflow-inducing widths.
- [x] `pnpm exec tsc --noEmit`, `pnpm lint`, `pnpm build`, and one Impeccable detector pass are recorded exactly.

## Route declaration
Delegated-direct bounded implementation; the task was scoped to the Cards dashboard component and shared stylesheet after inspecting existing CTA markup and responsive selectors.

## Verification
- `pnpm exec tsc --noEmit`
- `pnpm lint`
- `pnpm build`
- One Impeccable detector pass on the changed UI targets after source edits.

## Progress
- [x] Inspect existing Cards CTA markup and mobile breakpoint rules.
- [x] Create this task document before source writes.
- [x] Implement mobile CTA card structure and styling.
- [x] Run required checks and record any visual limitation.

## Verification outcomes
- `pnpm exec tsc --noEmit` — passed (exit 0).
- `pnpm lint` — passed (exit 0).
- `pnpm build` — passed (exit 0; Next.js 16.3.6 production build).
- Impeccable detector on `src/domains/cards/components/cards-dashboard.tsx` and `src/app/globals.css` — returned `[]`.

## Next step
Step 19 is complete; desktop/browser screenshot comparison remains available when an interactive browser surface is present.
