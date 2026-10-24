# Step 13: Align Cards with Proposal States

## Objective
Align Cards, New Card, and Review with the supplied Vokki Up HTML states across the available desktop/mobile-light views and existing dark theme, without changing local scheduling, AI-boundary, sync, or user-created group behavior.

## Problem and rationale
Cards has been implemented and adjusted across several product steps, but its overview/editor/review presentation may still diverge from the supplied contract. The previous Notes mismatch showed that extracting each visual state must precede changes; this task maps the referenced proposal states before editing. The bundle contains the mobile Cards/New Card/Review pages and desktop Cards/Review pages; it does not contain Cards-specific dark pages or desktop New Card/group create-detail pages, so those must use existing theme tokens and already-reviewed group flows rather than invented states.

## Scope
- Inspect bundle `33e5cc15-cb4f-41a0-896d-22e08a327918` and associated Cards, New Card, Review, and Groups proposal artifacts.
- Align overview structure/copy, user group pills and card counts, card search, card state/category presentation, primary actions, and active navigation.
- Align New Card structure/copy and its local form/AI mode states while preserving the provider-agnostic AI boundary and credential safety.
- Align Review progress, reveal, example, rating labels/states, completion, and repeat semantics while preserving local SRS and append-only review/sync events.
- Reuse local data; group names, statistics, and card values must not be replaced by proposal fixture values.
- Apply existing dark theme tokens to all aligned states; preserve readable focus/accessibility and responsive behavior.

## Constraints
- The HTML proposal is the sole visual source of truth; do not invent a replacement layout or copy.
- Preserve user-defined groups and local card assignments, AI-boundary interactions, SRS scheduling, and sync queue behavior.
- No remote operations, credentials/secrets, unrelated modules, Storybook, Docker, commits, or pushes.

## Authorized scope
`planning/tasks/step-13-cards-proposal-alignment.md`, `src/domains/cards/**`, `src/app/cards/**`, `src/app/review/**`, `src/app/globals.css`, `src/components/**`.

## Route declaration
Delegated direct, single writer. The work spans multiple non-trivial UI components and requires comparing proposal states against the current Cards/SRS/AI/sync flows before editing.

## Acceptance criteria
- Cards overview, New Card, Review, and related existing Groups screens reproduce the structure/copy/responsive hierarchy of the referenced proposal states where present.
- The overview provides group filtering/pills, search, cards with category and learning state, truthful local counts, and separate new/review CTAs.
- The card form preserves manual capture, group selection, category/tags, and the existing AI configuration boundary without introducing provider calls.
- Review preserves existing Again/Hard/Good/Easy scheduling/event semantics while matching proposal-visible reveal, pronunciation, example, completion, and keyboard/CTA states.
- User group names, assignments, scheduled-card values, and local sync queue operations survive unchanged.
- Dark mode uses existing theme tokens; layouts remain responsive and accessible.
- No unrelated module, remote behavior, or dependency is changed.

## Verification
- `pnpm exec tsc --noEmit`
- `pnpm lint`
- `pnpm build`
- Run the Impeccable mechanical detector once after edits: `C:\Users\maria\.agents\skills\impeccable\scripts\impeccable.cmd detect --json <changed targets>`.

## Progress
- [x] Read Impeccable skill and run `impeccable context`.
- [x] Inspect prior Cards and Groups task history, current domain/data, overview/editor/group/review components, and SRS/sync state surfaces.
- [x] Extract mobile Cards/New Card/Review and desktop Cards/Review proposal state structure and copy.
- [x] Map related group-state availability and compare existing CSS/tokens to the captured states. The supplied bundle has group filtering on the Cards overview, but no separate group create/detail screen; existing Step 10 behavior stays unchanged.
- [x] Implement proposal-aligned Cards/New Card/Review UI without changing domain scheduling, AI, or sync behavior.
- [x] Run required checks and the one detector pass; record exact outcomes and unavailable proposal states.

## Progress evidence
- The Cards header now reports the actual local deck size and due queue count; group names remain user data and are not replaced by the proposal fixtures.
- The library filters by actual part-of-speech values, searches local terms/meanings/tags, and shows category, group, actual learning stage, and scheduled date where available. No mastery percent is fabricated because the scheduler does not compute one.
- New Card now has proposal-style Con IA/Manual modes, a live local preview, category chips, group selection, and the required manual fields. The AI suggestion control is an explicit no-call placeholder; no provider request is made.
- Review now follows the proposal's three visible ratings: Difícil maps to the existing Again schedule (10-minute requeue), Bien to Good, and Fácil to Easy. SRS scheduling, prior Hard records, append-only review events, and daily-credit handling remain intact; the proposal itself exposes no separate Hard option.
- Review keyboard shortcuts use Space to reveal and 1/2/3 for the visible ratings. The app shell marks Cards active on both Cards and Review routes.
- The bundle has no Cards-specific dark screen, desktop New Card screen, or separate Groups create/detail pages; existing dark tokens and Step 10 group flow were retained.
- Proposal fixture totals, card names, mastered percentages, and streak values were not injected into local records.

## Verification results
- `pnpm exec tsc --noEmit` — passed (exit 0).
- `pnpm lint` — passed (exit 0).
- `pnpm build` — passed (exit 0); Next.js generated `/cards` and `/review` alongside existing routes.
- Impeccable detector (single run) — passed with `[]` for the changed targets.

## Next step
Continue with the next user-authorized task. Revisit Cards only if an actual dark or desktop New Card reference becomes available; keep domain schedules and user group data authoritative.

