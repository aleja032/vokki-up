# Step 18: Horizontal mobile collection rows

## Objective
Make the Cards groups row horizontally scrollable on narrow screens and adapt Home mobile collections only where the reference shows horizontal rows, without introducing page-level horizontal overflow.

## Scope
- Cards groups use fixed/minimum-width group cards, consistent gaps, and scroll snapping on narrow mobile/tablet widths; retain the New Group item and existing group interactions.
- Home preserves the established vertical content order. Inspect the available reference evidence for horizontal collections; where there is no Home groups row, do not fabricate one, and only adapt the statistics/action row if the proposal/reference supports it.
- Keep scrolling accessible to touch and keyboard, visible focus, subtle token-based scrollbar treatment, lateral padding, and dark mode.
- Do not change copy, palette, route behavior, or unrelated modules.

## Acceptance criteria
- [x] Narrow Cards view presents partial adjacent group cards and supports horizontal scroll/snap including New Group.
- [x] Horizontal scrollers are bounded to their content width, with full-bleed margins calibrated to app padding at narrow phone widths.
- [x] Home retains its greeting, featured cards, statistics, and lower section order; the existing four-statistic strip scrolls horizontally on narrow phones without inventing a Home group row.
- [x] Scrollers are keyboard-focusable, expose accessible labels, support touch momentum, use token-based scrollbars, and retain visible focus in either theme.
- [x] `pnpm exec tsc --noEmit`, `pnpm lint`, `pnpm build`, and one Impeccable detector pass are recorded exactly.

## Route declaration
Delegated-direct implementation continuing this task branch; one bounded writer is appropriate because the work may touch Cards/Home component styles and shared CSS. Source changes remain limited to the authorized surfaces.

## Verification
- Structural check of the changed scroller markup and responsive CSS.
- `pnpm exec tsc --noEmit`
- `pnpm lint`
- `pnpm build`
- One Impeccable detector pass on changed UI targets after edits.

## Progress
- [x] Load the Impeccable skill and inspect current Cards/Home collection structure.
- [x] Create this task document before source edits.
- [x] Confirm available screenshot/reference details and identify the appropriate Home row; Home has no group-card collection, so no group data is invented. Its existing four-statistic strip is the only matching collection of cards to adapt.
- [x] Implement responsive horizontal row behavior.
- [x] Run requested checks and record any reference ambiguity.

## Verification outcomes
- `pnpm exec tsc --noEmit` — passed (exit 0).
- `pnpm lint` — passed (exit 0).
- `pnpm build` — passed (exit 0; Next.js 16.3.6 production build).
- Impeccable detector on `src/domains/cards/components/card-group-list.tsx`, `src/domains/home/components/statistics-strip.tsx`, and `src/app/globals.css` — returned `[]`.

## Next step
Step 18 is complete; visual screenshot review remains useful when the image pixels or in-app browser are available.

## Reference ambiguity
The request describes the attached screenshots but the screenshot pixels were not exposed to this worker. Exact card dimensions and scroll affordance styling therefore cannot be pixel-matched; implementation follows the explicit behavior (partial adjacent Cards group cards and an existing Home metric-card row) while preserving current tokens and content order.
