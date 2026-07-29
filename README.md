# Phaedra

My personal blog. A static site on GitHub Pages, backed by Supabase (Postgres,
Auth, and Storage). No server to run.

## Running it locally

Uses Yarn 4 through corepack, so enable it once with `corepack enable`. For the
local database you also need Docker running and the Supabase CLI
(`brew install supabase/tap/supabase`).

One command does the whole thing. It boots a local Supabase stack, seeds an admin
login and a few sample posts, and starts Vite.

```bash
yarn install
yarn dev:local
```

That logs you in as `admin@example.com` with the password `password123`, and
Supabase Studio is at http://127.0.0.1:54323. Stop the stack with `yarn stop:local`.

To point at your real project instead, or run with no backend at all, copy the env
file and start Vite the normal way.

```bash
cp .env.example .env.local
yarn install
yarn dev
```

Without any Supabase config the app still runs, the data calls just come back empty.

## Commands

| Command                  | What it does                       |
| ------------------------ | ---------------------------------- |
| `yarn dev`               | Vite dev server                    |
| `yarn dev:local`         | Local Supabase, seed, then Vite    |
| `yarn stop:local`        | Stop the local Supabase stack      |
| `yarn build`             | Typecheck and SSG build to `dist/` |
| `yarn preview`           | Serve the built site               |
| `yarn lint` / `format`   | oxlint / prettier                  |
| `yarn test` / `test:e2e` | Vitest unit / Playwright e2e       |
