# Card AI extraction

## Objective
Connect the Cards AI capture mockup to the existing provider boundary so text and image vocabulary extraction produce reviewable candidates that can be accepted into local Cards storage.

## Problem
The `/cards/ai` UI currently renders static sample states. The API capability exists, but its server implementation returns a development mock or unavailable response, and accepted candidates are not mapped into the Cards domain.

## Scope
- Wire the AI capture flow to `requestCardCapture` for text and image inputs.
- Implement a provider adapter that supports the configured provider/model without exposing secrets to the browser.
- Normalize AI candidates into the Cards domain, including pronunciation, example, related words, and correction metadata when available.
- Allow reviewing, rejecting, and accepting multiple candidates into a selected user-created group.
- Preserve local-first behavior and existing UI structure; do not redesign the approved mockups.
- Add focused unit/integration tests for validation, normalization, and persistence mapping.

## Constraints
- AI remains online-only; manual card creation and local storage remain available offline.
- Provider credentials are server-side only.
- Do not add Storybook, Docker, or unrelated infrastructure.

## Acceptance criteria
- A text capture request reaches the configured AI provider through `/api/ai/card-capture` and returns validated candidates.
- An image capture request sends the selected image with bounded size/type validation and returns validated candidates when the provider supports vision.
- The review UI renders candidates without unbounded page growth and supports select/reject/edit before confirmation.
- Confirming candidates creates local cards with stable IDs, selected group, pronunciation, example, and related words.
- Provider/API errors remain actionable and do not create partial cards.
- Existing card review, sync, typecheck, lint, build, and focused tests remain green.

## Tasks
- [x] AI-01 Replace mock/unavailable server path with configured provider adapter and response normalization.
- [x] AI-02 Connect `/cards/ai` capture state to the API and candidate review actions.
- [x] AI-03 Map accepted candidates into the Cards local persistence boundary and selected group.
- [x] AI-04 Add focused tests and run repository checks.

## Route
Delegated direct: one read-only explorer mapped the current flow; one bounded writer will implement the multi-file slice. Parent performs a structural spot check and verification.

## Progress
- Status: implementation complete locally; delivery pending user review.
- Route: delegated direct; one writer handles the bounded multi-file behavior because the capture UI, provider boundary, and Cards persistence must change together.
- Last evidence: 16 Vitest files/59 tests, typecheck, lint, and production build passed.
- Next step: configure `GEMINI_API_KEY` in the server/deployment environment, exercise `/cards/ai`, then commit/push the work unit.

## Delivery
- Strategy: single work-unit commit for the bounded AI/Card integration slice.
- Forecast: approximately 250 authored lines excluding generated files.
