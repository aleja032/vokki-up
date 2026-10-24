# Step 14: Writing proposal alignment

## Objective
Align the Writing module to the supplied HTML proposal's mobile-light, desktop, and feedback states while preserving local draft tracking and the provider-agnostic AI boundary.

## Problem and rationale
The existing Writing UI presents a generic category/prompt workflow and sample-only feedback, while the proposal defines a focused writing exercise with a 150-word target, local-save status, an analysis CTA, a structured scored response, actionable corrections, and recent-text history. The earlier Notes deviation occurred because functionality was implemented before extracting each responsive state; this task records the proposal states before changing the UI.

## Scope
- Extract the available mobile-light and desktop Writing structures and visible copy from HTML bundle `bc7e5421-ef18-4f65-b400-85a24422fc7c` and inspect its feedback state.
- Reshape Writing components to match those states, retaining category choices, editor, word counter/150-word target, CTA, feedback metrics, corrections, card-creation affordance, and recent texts where represented.
- Keep draft/history interactions local and use the existing typed AI capability boundary only as a non-remote placeholder; no provider calls.
- Reuse current responsive and dark-theme tokens. No Writing-specific dark reference state was present in the inspected bundle; dark behavior must therefore follow existing tokens without claiming pixel parity to an unavailable reference.

## Constraints
- Treat the bundled HTML as the sole visual source of truth; do not invent copy or a different layout.
- Preserve reusable components, accessibility, responsive behavior, and current persisted/local sync behavior.
- No remote calls, credentials, Storybook, Docker, unrelated dependencies, commits, or pushes.

## Authorized scope
- `planning/tasks/step-14-writing-proposal-alignment.md`
- `src/domains/writing/**`
- `src/app/writing/**`
- `src/app/globals.css`
- `src/components/**`

## Route declaration
Direct implementation in the existing Writing domain. The component, data, and styling changes are a single proposal-alignment task; no parallel writer is used.

## Acceptance criteria
- [x] Mobile light layout matches the Writing proposal's title, category/theme choice, prompt, editor, 150-word count, local-save status, analysis CTA, feedback, and navigation.
- [x] Desktop layout matches the proposal's app shell, editor/feedback composition, and recent-text section.
- [x] Feedback displays the proposal's overall score, clarity/vocabulary/grammar values, correction examples/explanations, and create-card action without claiming generated analysis.
- [x] Draft editing, category selection, and history remain local and componentized; no remote provider is called.
- [x] Existing light/dark tokens and mobile/desktop navigation are preserved; missing Writing-specific dark reference is disclosed.
- [x] TypeScript, lint, build, and Impeccable detector checks pass.

## Verification
- pnpm exec tsc --noEmit — exit 0.
- pnpm lint — exit 0.
- pnpm build — exit 0; generated /writing and other configured routes.
- Impeccable detector — exit 0, output [].

## Progress
- [x] Read Impeccable instructions and inspect mobile-light/desktop Writing HTML and feedback state.
- [x] Inspect current Writing route, domain components, styles, and Step 3 implementation record.
- [x] Implement proposal-aligned Writing UI and local interactions.
- [x] Run requested checks and detector; record results.

## Reference limitations
- The bundled mobile and desktop HTML includes unresolved {{c.label}} / {{catLower}} category placeholders; existing typed category choices were retained because exact labels are not recoverable from these rendered states.
- No Writing-specific dark screenshot was present in the bundle. Dark colors use existing theme tokens.
- The mobile feedback state says three grammar details while desktop says two; the UI reproduces each viewport label and shows the two correction examples visible in the proposal.

## Next step
Writing proposal alignment is complete; continue with the next requested product task.
