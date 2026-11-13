# Word library

## Objective

Create a browsable local Word Library with 200 curated English vocabulary entries in each existing category, letting users choose which entries to add to their own card collections.

## Problem and rationale

Users currently have to create vocabulary cards themselves. A separate local catalog lets them discover useful vocabulary and deliberately add entries to one of their own groups without mixing shared catalog data into personal card storage.

## Scope

- 800 catalog entries: Trabajo, Viajes, Día a día, Frases útiles.
- Search, category filtering, preview, duplicate-safe add-to-collection flow.
- Entire word cards are selectable; selected entries go to their matching default collection with a compact add action next to the search field.
- Catalog is local and separate from personal cards; no automatic additions, Supabase, or external API.

## Constraints

- Keep all work on the user-selected `stage` branch; do not use `main` or push.
- WL-01 introduced a small representative catalog fixture; WL-02 owns and now supplies the 800 curated entries.
- Preserve existing cards, collection persistence, and part-of-speech categories; catalog topic categories are separate.

## Acceptance criteria

- Users can browse and search catalog vocabulary by topic category and inspect its meaning, pronunciation, and example.
- Users can select anywhere on a word card and add selected entries to their category-matched default collections without choosing a group manually.
- Terms already present in personal cards are not duplicated, including case/spacing variants.
- Catalog entries remain local static data and are not automatically added to personal storage.

## Tasks

- [x] WL-01 — Implement local catalog model, browse/search UI, and duplicate-safe add flow. Route: delegated direct. Added `/cards/word-library`, a typed static catalog, category/search browsing, preview, and normalized duplicate-safe add. WL-03 later routed selected entries by category. Verification passed: focused Vitest (3 tests), ESLint, TypeScript, and Prettier checks. Work-unit commit: `35c9dea` (`feat(cards): add searchable word library`).
- [x] WL-02 — Add 200 curated entries for each of the four categories. Route: delegated direct. Authorized surfaces: `src/domains/cards/word-library/catalog.ts`, `src/domains/cards/word-library/catalog.test.ts`, and this task record. Acceptance: exactly 800 entries are available, with 200 in each intended category; each entry has distinct searchable vocabulary and a usable example, meaning, and pronunciation. Verification passed: focused catalog tests (3 tests), TypeScript, ESLint, Prettier, and `git diff --check`. Work-unit commit: `ee7e281` (`feat(cards): curate word library vocabulary`).
- [x] WL-03 — Simplify Word Library selection and category-based collection routing. Route: delegated direct. The full word card toggles its checkbox; the group selector is removed; selected entries route to matching `work`, `travel`, `daily`, or `phrases` collections; the compact mobile action sits beside search at the top. Existing normalized duplicate-safe insertion remains in use. Verification passed: focused Vitest (5 tests), ESLint, TypeScript, Prettier, and `git diff --check`. Work-unit commits: `ed0936e` (`feat(cards): simplify word library add flow`), `d67f1d5` (`feat(cards): move word library add near search`).
- [x] WL-04 — Make category routing work with generated collection IDs, disable already-owned catalog terms, add restrained motion and pagination, and correct the `what do you do?` example. Route: delegated direct. Collection routing now prefers a category-matching collection name before retaining legacy ID fallback; owned entries are visibly marked and their checkboxes disabled; the catalog uses 24-entry pages (not infinite scroll), resets pagination on search/category changes, and respects reduced-motion preferences. Tightened the narrow mobile search/CTA row. Verification passed: focused Vitest (4 tests), `pnpm exec tsc --noEmit`, `pnpm lint`, Prettier check, and `git diff --check`. Work-unit commit: `9e90c05` (`fix(cards): complete word library UX`).

## Next step

All Word Library tasks are complete. The catalog is local static data and adds entries only after user selection; no API or backend source was introduced.

## Relevant files

- `src/domains/cards/word-library/catalog.ts` — local typed catalog, filtering, normalization, and add helper.
- `src/domains/cards/components/word-library.tsx` — browse, search, selection, preview, and collection UI.
- `src/domains/cards/hooks/use-cards-dashboard.ts` — safe insertion into existing user-owned card persistence.
- `src/app/cards/word-library/page.tsx` — App Router route entry.
