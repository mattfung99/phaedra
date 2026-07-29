# Phaedra

A personal blog. Static frontend on **GitHub Pages**, backed by **Supabase**
(Postgres + Auth + Storage). No server to run — Supabase is the backend, and the
public site is pre-rendered to static HTML for SEO.

## Stack

- **Vite + React 19 + TypeScript**, Tailwind v4 + **shadcn/ui**
- **vite-react-ssg** — public pages (`/`, `/blog`, `/blog/:slug`, `/about`,
  `/contact`) are pre-rendered at build with baked-in `<head>` meta + JSON-LD.
  Admin is client-only behind an auth guard.
- **TanStack Query** for admin data; **TipTap** editor
- **Supabase**: single `posts` table with RLS, Auth (email/password, signup off),
  Storage (`post-images`). Writes go through Edge Functions (`save-post`,
  `delete-post`) that sanitize content server-side; RLS forbids direct client writes.

## Local development

```bash
cp .env.example .env.local   # fill in your Supabase URL + anon key
npm install
npm run dev
```

Without a Supabase project the app still runs — data calls short-circuit to empty.

For an isolated database to test writes/admin flows (instead of touching prod),
run a **local Supabase** stack and point `.env.local` at it:

```bash
supabase start          # applies migrations + serves the Edge Functions locally
supabase status         # copy API URL + anon key into .env.local
```

CI's `e2e` job does exactly this on every PR (seeds a test admin + post, then runs
the full Playwright suite), so nothing in CI touches production.

### Scripts

| Script                    | What                             |
| ------------------------- | -------------------------------- |
| `npm run dev`             | Vite dev server                  |
| `npm run build`           | Typecheck + SSG build to `dist/` |
| `npm run preview`         | Serve the built site             |
| `npm run lint` / `format` | oxlint / prettier                |
| `npm test` / `test:e2e`   | Vitest unit / Playwright e2e     |

## Supabase setup (one-time, dashboard)

1. Create a project; copy the URL, anon key, and service_role key.
2. Apply the schema: `supabase link --project-ref <ref>` then `supabase db push`
   (or via the `migrations.yml` workflow).
3. Deploy functions: `supabase functions deploy save-post delete-post`.
4. Provision admin accounts (Authentication → Users). Public signup is disabled.
   Optionally set `author_name` in a user's metadata for the byline.
5. Put `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` in `.env.local`, and the CI
   secrets (`SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE`,
   `SUPABASE_ACCESS_TOKEN`, `SUPABASE_PROJECT_REF`, `SUPABASE_DB_PASSWORD`).

## Deploy

GitHub Actions builds the SSG output and deploys to GitHub Pages (Pages source =
"GitHub Actions"). `base` in `vite.config.ts` is `/phaedra/` — change it if the
repo is renamed or a custom domain is added.
