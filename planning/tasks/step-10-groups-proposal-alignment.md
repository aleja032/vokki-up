# Step 10: Align Groups Flow with Proposal

## Objective

Replace the generic Cards group grid/filter presentation with the proposal's dedicated new-group and group-detail states while preserving user-created names and local cards.

## Scope

- Reproduce the HTML proposal's `Grupos · nuevo grupo` and `Grupos · detalle` screen structure, copy, spacing, and responsive behavior.
- Keep group creation, detail opening, card listing, and back navigation local and reusable.
- Preserve all user-defined group names and card-to-group relationships.
- Keep Cards overview and existing editor interactions coherent with the focused Groups states.

Out of scope: unrelated Cards, AI, sync, storage, or shell changes; remote calls; Storybook; Docker.

## Route declaration

Direct visual refinement. The supplied HTML is the sole source of truth for the two states; the existing application provides the local group/card data and responsive design tokens.

## Acceptance criteria

- New-group and group-detail states match the supplied proposal rather than a generic grid.
- Users can create a named group, open it, see the cards belonging to it, and return to the group listing.
- Existing group IDs/names and group assignments remain intact; no initial group data overwrites saved groups.
- The flow remains componentized and works on narrow and wide viewports without horizontal overflow.
- No unrelated module or remote behavior is changed.

## Verification

- `pnpm exec tsc --noEmit`
- `pnpm lint`
- `pnpm build`
- `C:\Users\maria\.agents\skills\impeccable\scripts\impeccable.cmd detect --json <changed targets>`

## Progress

- [x] Created this task before source changes and loaded Impeccable context.
- [x] Inspect exact proposal screens and existing group/card flows.
- [x] Implement and verify the proposal-aligned group flow.

## Progress evidence

- Replaced the Cards group tile grid with a compact folder list that preserves existing group IDs, names, descriptions, and assigned cards.
- Added the dedicated group-create screen with preview, 30-character validation, duplicate-name checks, quick ideas, six proposal colors, optional description, and create/cancel actions.
- Added the group detail screen with group-scoped card list, truthful local counts, add-card flow, back navigation, and a review link that filters by group.
- Preserved existing colors and accepted new color tones in the persisted group validator; cards added from detail default to the active group.
- `pnpm exec tsc --noEmit`: passed.
- `pnpm lint`: passed.
- `pnpm build`: passed.
- Impeccable detector (single pass): returned `[]` for the changed targets.
- Proposal uses sample values/statuses such as “40% dominadas” and per-card learning labels; these are not fabricated because the app's local data does not define a mastery metric.

## Next step

Keep future group editing and sync changes behind this local data flow; avoid replacing user-defined groups with fixture defaults.
