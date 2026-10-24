# Step 11: Align Home with Proposal

## Objective

Align the Home dashboard structure and responsive presentation with the attached proposal, removing repeated statistics while preserving truthful local data and existing navigation.

## Scope

- Reconcile the desktop, mobile light, and mobile dark Home proposal states.
- Present greeting and next session with `Meta de hoy`, then four independent statistics, `Actividad de hoy`, and `Tu semana`.
- Remove overlapping metric presentation between the old weekly progress component and StatisticsStrip; keep reusable components.
- Preserve local review/event data, navigation, keyboard access, and app theme behavior.

Out of scope: remote data, new analytics persistence, unrelated routes, Storybook, Docker, commits, and pushes.

## Route declaration

Direct refinement of the existing Home dashboard. The supplied HTML remains the only visual source of truth; no replacement palette or copy is authorized.

## Acceptance criteria

- Home renders the requested content order and only one occurrence of each statistic.
- The four separate metrics retain the supplied labels and values when trustworthy local data exists; unavailable measurements are not fabricated.
- `Meta de hoy`, daily activity, and weekly activity are separate reusable sections with working existing navigation.
- Desktop, narrow viewport, and dark-theme layout remain accessible without horizontal overflow.
- No unrelated modules or remote behaviors change.

## Verification

- `pnpm exec tsc --noEmit`
- `pnpm lint`
- `pnpm build`
- `C:\Users\maria\.agents\skills\impeccable\scripts\impeccable.cmd detect --json <changed targets>`

## Progress

- [x] Created this task before source edits and loaded Impeccable context.
- [x] Inspect desktop, mobile-light, and mobile-dark proposal states and local Home data.
- [x] Implement the single-source statistics layout and verify all checks.

## Progress evidence

- Inspected the proposal's separate desktop Home state and its 430 × 932 light and dark mobile states. The desktop is the state that contains `Meta de hoy` plus four independent stat cards; mobile light/dark group goal progress into `Tu semana` and use different greeting/support copy.
- Reordered the responsive Home into greeting, next session plus `Meta de hoy`, four independent statistics, then `Actividad de hoy` and `Tu semana`. Removed streak/seen/mastered values from the weekly chart component.
- Dark greeting/support copy follows the app's existing explicit and system dark theme behavior. Current app palette and navigation were retained.
- Streak and words seen are now derived from locally stored credited review events. The current schema has no mastery definition or study-duration field, so those two metrics display an accessible unavailable marker rather than fabricated numbers. Daily progress and weekly activity remain event-derived.
- `pnpm exec tsc --noEmit`: passed.
- `pnpm lint`: passed.
- `pnpm build`: passed.
- Impeccable detector (single pass): returned `[]` for changed targets.

## Proposal/data limitation

The desktop proposal shows sample values `12`, `48`, `12`, and `64 min`. `Mastered words` has no definition in the current local schedule model, and no local study-duration events are recorded, so those two sample values cannot be reproduced as real data yet. The mobile proposal also nests the daily goal inside `Tu semana`; the implementation follows the requested shared content order across breakpoints instead of repeating metrics.

## Next step

When local study duration and an explicit mastery rule are added, replace the unavailable markers with those real values without reintroducing metrics inside `Tu semana`.
