# Vokki Up

Vokki Up is a mobile-first English-learning product being developed on Next.js. Its direction is a componentized web app with a PWA-oriented experience; this README describes the project foundation and does not claim unimplemented product or offline behavior.

## Development

Requirements: Node.js 24 or later and pnpm 10.29.3 (the version pinned in `package.json`).

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Configuration

Copy `.env.example` to `.env.local` when configuring integrations. The template contains placeholders for public Supabase connection settings and AI provider/model selection only. Do not put provider credentials, Supabase service-role keys, or other secrets in `NEXT_PUBLIC_*` variables or commit them. Keep server-side credentials in the deployment environment.

## Available checks

```bash
pnpm lint
pnpm build
```

The current package scripts do not define a test command. Add and document product-specific checks as those capabilities are implemented.
