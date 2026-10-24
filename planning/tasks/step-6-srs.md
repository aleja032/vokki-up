# Step 6: Local spaced-repetition scheduling

## Objective
Make card review scheduling locally durable and predictable, with a replaceable pure scheduler boundary, append-only review history, and daily progress credit independent from review volume.

## Scope
- Add typed per-card schedule state, review-event history, scheduler port/initial algorithm, and pure progress derivation.
- Use Again/Hard/Good/Easy ratings to update due dates and repetition state; keep Again eligible for repeat practice in the current session.
- Persist scheduling and review events using the existing versioned local-storage boundary.
- Derive review queue and home daily credit/progress from cards, schedules, and history.
- Document the initial interval heuristic and 90% desired-retention assumption; do not claim FSRS behavior.

## Route declaration
Delegated direct writer. This crosses the card review flow, persisted card scheduling/history, and home progress consumers, so implementation is kept within one scoped writer task.

## Acceptance criteria
- [x] A pure typed scheduler interface can be replaced by FSRS without coupling UI to interval math.
- [x] Again/Hard/Good/Easy produce deterministic schedule updates with an injected timestamp.
- [x] Every rating appends one review event; prior events are never overwritten by application code.
- [x] Multiple practices of the same card on a local calendar day remain in history, but only its first event that day earns daily progress credit.
- [x] Review queue includes new and currently due cards; Again may repeat within the active session without permanently inflating daily credit.
- [x] Schedule and review-event state survive reload using the existing versioned browser storage boundary.
- [x] Home daily progress reflects credit count rather than raw event count; auth, sync, AI, CSV, and remote services remain untouched.
- [x] Current algorithm and the 90% target-retention assumption are documented.

## Scheduling policy
- `Again`: 10 minutes and reset the repetition count.
- `Hard`: first interval 1 day; otherwise grow the prior interval by 1.2×, with a 1-day minimum.
- `Good`: first interval 2 days; otherwise grow by 2.5×, with a 2-day minimum.
- `Easy`: first interval 4 days; otherwise grow by 3×, with a 4-day minimum.
- `DESIRED_RETENTION = 0.9` records the 90% product target assumption for a future FSRS scheduler. The initial transparent interval ladder does not calculate recall probability or guarantee that retention.
- Each rating appends history. The first event for a card and stored local calendar date gets daily credit; later same-day reviews stay in history without additional credit.
- The due queue includes new and due cards (up to ten per session); `Again` can requeue one extra practice per card in a session, and restarting the session permits more practice.

## Verification
- Focused deterministic scheduler tests if the existing test runner supports them.
- `pnpm exec tsc --noEmit`
- `pnpm lint`
- `pnpm build`
- Read back changed source/task files and confirm no writes outside the allowed surfaces.

## Progress
- [x] Inspected existing local persistence, review flow, home progress, and remembered daily-credit policy.
- [x] Implement scheduler boundary, persisted events/schedules, and progress integration.
- [x] Run and record focused and required verification.

## Verification results
- Focused tests: `pnpm exec vitest run src/domains/cards/scheduling/scheduler.test.ts` — passed (3 tests).
- `pnpm exec tsc --noEmit` — passed.
- `pnpm lint` — passed.
- `pnpm build` — passed; all 11 static App Router pages generated.
- Browser-level reload/offline interaction testing was not run.

## Next step
Continue to the next requested product step; review scheduling and event-derived daily credit are local-only and do not sync.
