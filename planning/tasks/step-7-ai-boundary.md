# Step 7: Provider-Agnostic AI Boundary

## Objective

Establish a typed, server-side capability boundary for card capture and writing feedback without connecting to any remote AI provider.

## Scope

- Keep the existing provider/model settings UI and make its options share the boundary's allowlist.
- Add typed capability inputs, outputs, validation, and error contracts.
- Provide a deterministic mock provider for local development and local API routes.
- Ensure provider credentials are never accepted from the browser or exposed in responses.
- Document future server-only environment variables and the next provider integration point.

Out of scope: Gemini, OpenAI, Vercel Gateway, Supabase, remote calls, persistence changes, and UI redesign.

## Route declaration

Delegated direct writer. The existing settings choices and local preference keys are the evidence for the provider/model catalog; implementation is isolated to this task's authorized paths. Verification will run the requested TypeScript, lint, and production build commands.

## Acceptance criteria

- `card-capture` and `writing-feedback` have typed request/response boundaries.
- Provider and model IDs are allowlisted together; invalid selections and malformed inputs produce typed errors.
- API handlers are server-side and use only the mock adapter in development; production reports the capability unavailable rather than falling back to a real provider.
- Client requests can read the persisted provider/model preference, but contain no credential field or secret material.
- Existing settings labels and available models remain unchanged.
- Future environment variable names and adapter integration point are documented without reading credentials or making calls.

## Verification

- `pnpm exec tsc --noEmit`
- `pnpm lint`
- `pnpm build`
- `pnpm exec vitest run src/domains/ai/validation.test.ts`

## Future provider configuration

Potential server-only variables are `GEMINI_API_KEY`, `OPENAI_API_KEY`, and `AI_GATEWAY_API_KEY` (only if the gateway is selected). They are documentation-only in this step: no code reads them, no values are checked in, and they must never use a `NEXT_PUBLIC_` prefix. The next integration point is a provider adapter implementing `AiCapabilityProvider` behind `src/lib/ai/server.ts`, with the same request validation and output contract.

## Progress

- [x] Inspected existing provider/model settings and browser preference keys.
- [x] Implemented shared catalog, typed contracts, mock adapter, API routes, and preference-aware client boundary.
- [x] Verified types, lint, production build, and focused allowlist tests.

## Next step

Add an explicitly authorized server-side provider adapter behind the same validated capability interface; keep secrets server-only and preserve the mock adapter for local development.
