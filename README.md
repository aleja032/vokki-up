# Vokki Up

Mobile-first English study app. Notes, vocabulary candidates, flashcards, and review history are stored in the browser with IndexedDB. Image-based vocabulary suggestions are optional and require an explicit learner action; suggestions must be confirmed before becoming cards.

## Local development

```bash
npm install
cp .env.example .env.local
npm run dev
```

Leave the example values unset or replace them with your own Supabase project URL and **publishable** key. The app works without them; manual vocabulary capture remains available. Any `VITE_*` value is embedded in the browser bundle and is public. Never put a Gemini API key or a Supabase service-role/secret key in `.env.local`.

## Optional study sync (not deployed by this repository)

Study data remains in IndexedDB until the learner explicitly presses **Sincronizar ahora**. The first press requests Supabase anonymous sign-in if no session exists. Configure a real project URL and publishable key in `.env.local`, enable anonymous sign-ins in Supabase Auth, and apply `supabase/migrations/202610180001_initial_study_sync.sql` to that project before testing sync. The migration creates per-user cards, notes, review logs, quiz attempts, and writing sessions with row-level security based on `auth.uid()`. Do not put service-role keys in the browser. Remote project configuration and migration application are separate, authorized operations; this repository does not do either automatically.

Sync uses stable record IDs and timestamps. Newer mutable records win; the server wins exact timestamp ties. Review logs and quiz attempts are append-only by ID. Note deletion is a timestamped tombstone so a deleted note does not reappear after a later sync. A failed remote read or write does not delete local data; partial uploads can be retried. Device clocks and concurrent edits are not a substitute for server-side transactional conflict resolution, so avoid editing the same item simultaneously on multiple devices. Attached image blobs remain on the originating device and are never uploaded by study sync; only note text and candidate metadata sync. Export important images separately.

Anonymous identity is stored in that browser's Supabase session. Clearing site data or losing that session can make previously synced rows inaccessible to a new anonymous identity, even when local IndexedDB survives. Do not treat anonymous sync as an account-recovery or backup guarantee. If anonymous sign-in is disabled, the button reports that limitation and local study continues.

## Optional AI boundary

The browser calls `supabase/functions/vokki-ai` through the configured Supabase project. The function reads `GEMINI_API_KEY` and `GEMINI_MODEL` from its **server-side** environment. Set these as Supabase Edge Function secrets in your own project; do not add them to this repository or to `VITE_*` variables. Choose a Gemini model available to your account that supports structured JSON output and inline images.

The function accepts four actions: `flashcards`, `quiz`, and `writing-feedback` with non-empty text up to 5,000 characters, plus `image-vocabulary` with a PNG, JPEG, or WebP image up to 8 MB. It asks Gemini for structured JSON and validates the returned shape before sending it to the client. The UI offers image vocabulary extraction, quiz generation, and writing feedback when the backend is configured; local study remains available without it.

This repository does **not** deploy the function or configure a Supabase project. Before deployment, configure the function's invocation/authentication mode and abuse controls for a public client according to your project's policy. The publishable key is public identification, not protection against request volume or Gemini charges. Keep local/offline study as the fallback if the function is unavailable.

Selecting or saving an image keeps it on the device. A copy is sent to Supabase and Gemini **only** when the learner presses “Extraer palabras para revisar” on a saved note. The learner can edit, reject, or confirm each suggestion.

## Checks

```bash
npm test -- --run
npm run build
npm run lint
```

The test suite covers the local study logic and the browser-to-function payload/response boundary. Live Gemini behavior, Supabase deployment, and Deno function execution require a configured project and are not exercised by these local checks.

## Local PWA verification

The service worker is generated for a production build. Run `npm run build` followed by `npm run preview`, then open the local preview URL in a supported browser (localhost is a secure context). Wait until the banner says the app is ready to open offline. In DevTools, confirm the manifest has the Vokki Up icons and the service worker controls the page. Reload once, switch DevTools Network to Offline, and reload again: the app shell should open. Create a note and a card, reload while offline, and confirm both still appear. The content is stored in this browser's IndexedDB; clearing site data removes it. AI extraction and generation require a configured backend and network connection.

On Chrome or Edge, use the **Instalar Vokki Up** button only if the browser offers it. On iPhone or iPad, use **Compartir → Agregar a pantalla de inicio** in Safari. Install availability varies by browser and device; an install button is not displayed unless the browser emits an install prompt. Service-worker registration and offline reload are not exercised by the unit tests, so verify them manually in a production preview before relying on offline access.
