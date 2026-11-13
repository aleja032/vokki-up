# Word library

## Objective

Create a browsable local Word Library with 200 curated English vocabulary entries in each existing category, letting users choose which entries to add to their own card collections.

## Problem and rationale

Users currently have to create vocabulary cards themselves. A separate local catalog lets them discover useful vocabulary and deliberately add entries to one of their own groups without mixing shared catalog data into personal card storage.

## Scope

- 800 catalog entries: Trabajo, Viajes, Día a día, Frases útiles.
- Search, category filtering, preview, duplicate-safe add-to-collection flow.
- Catalog is local and separate from personal cards; no automatic additions, Supabase, or external API.

## Constraints

- Keep all work on the user-selected `stage` branch; do not use `main` or push.
- WL-01 adds only a small representative catalog fixture. WL-02 owns the 800 curated entries.
- Preserve existing cards, collection persistence, and part-of-speech categories; catalog topic categories are separate.

## Acceptance criteria

- Users can browse and search catalog vocabulary by topic category and inspect its meaning, pronunciation, and example.
- Users can select one or more entries and add them to a chosen personal group.
- Terms already present in personal cards are not duplicated, including case/spacing variants.
- Catalog entries remain local static data and are not automatically added to personal storage.

## Tasks

- [x] WL-01 — Implement local catalog model, browse/search UI, and duplicate-safe add flow. Route: delegated direct. Added `/cards/word-library`, a typed static catalog, category/search browsing, preview, group selection, and normalized duplicate-safe add. Verification passed: focused Vitest (3 tests), ESLint, TypeScript, and Prettier checks. Work-unit commit: `35c9dea` (`feat(cards): add searchable word library`).
- [ ] WL-02 — Add 200 curated entries for each of the four categories. Route: delegated. Acceptance: 800 entries are available and associated with the intended categories.

## Next step

Implement WL-02 by expanding the catalog fixture to 200 quality-checked entries per category.

## Relevant files

- `src/domains/cards/word-library/catalog.ts` — local typed catalog, filtering, normalization, and add helper.
- `src/domains/cards/components/word-library.tsx` — browse, search, selection, preview, and collection UI.
- `src/domains/cards/hooks/use-cards-dashboard.ts` — safe insertion into existing user-owned card persistence.
- `src/app/cards/word-library/page.tsx` — App Router route entry.
