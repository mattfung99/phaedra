# Phaedra

My personal blog. It's a static site on GitHub Pages with Supabase doing the
backend work (Postgres, Auth, and Storage), so there's no server to babysit. The
public pages get pre-rendered to plain HTML at build time, which keeps them fast
and lets search engines actually read them.

## What it's built with

- Vite, React 19, and TypeScript, styled with Tailwind v4 and shadcn/ui
- vite-react-ssg pre-renders the public pages (`/`, `/blog`, `/blog/:slug`,
  `/about`, `/contact`) with real `<head>` tags and JSON-LD baked in. The admin
  area is client-only and sits behind an auth guard.
- TanStack Query on the admin side, with a TipTap editor for writing posts
- Supabase holds a single `posts` table protected by row-level security. Auth is
  email and password with signups turned off, and cover images live in a
  `post-images` bucket. Every write goes through an Edge Function (`save-post` and
  `delete-post`) that sanitizes the HTML on the server, and RLS stops the client
  from writing directly. There's no way to sneak unsanitized content in.

## Running it locally

The easy way is one command. It spins up a local Supabase stack, points the dev
server at it, seeds an admin login plus a few sample posts, and starts Vite. You
need Docker running and the Supabase CLI installed
(`brew install supabase/tap/supabase`).

```bash
npm install
npm run dev:local
```

That logs you in as `admin@example.com` with the password `password123`, and
Supabase Studio is at http://127.0.0.1:54323. When you're done, `npm run stop:local`
shuts the stack down.

If you'd rather point at your real project, or run with no backend at all, copy the
example env file and start the normal dev server.

```bash
cp .env.example .env.local
npm install
npm run dev
```

The app still runs without any Supabase config. The data calls just come back
empty. And you don't have to worry about the two getting crossed. `dev:local`
writes to `.env.development.local`, which only applies in dev, so it never touches
the `.env.local` your production builds use.

The CI e2e job stands up the exact same local stack on every pull request and runs
the full Playwright suite against it, so nothing in CI ever touches production.

### The scripts

| Script                    | What it does                       |
| ------------------------- | ---------------------------------- |
| `npm run dev`             | Vite dev server                    |
| `npm run dev:local`       | Local Supabase, seed, then Vite    |
| `npm run stop:local`      | Stop the local Supabase stack      |
| `npm run build`           | Typecheck and SSG build to `dist/` |
| `npm run preview`         | Serve the built site               |
| `npm run lint` / `format` | oxlint / prettier                  |
| `npm test` / `test:e2e`   | Vitest unit / Playwright e2e       |

## Setting up Supabase

You only do this once, in the dashboard.

1. Create a project and grab the URL, anon key, and service_role key.
2. Apply the schema with `supabase link --project-ref <ref>` then
   `supabase db push`, or just let the `migrations.yml` workflow do it.
3. Deploy the functions with `supabase functions deploy save-post delete-post`.
4. Add your admin accounts under Authentication, then Users. Public signup is off,
   so nobody else can register. If you want a nice byline, set `author_name` in the
   user's metadata.
5. Drop `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` into `.env.local`, and add
   the CI secrets: `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE`,
   `SUPABASE_ACCESS_TOKEN`, `SUPABASE_PROJECT_REF`, and `SUPABASE_DB_PASSWORD`.

## Deploying

GitHub Actions builds the site and ships it to GitHub Pages. Set the Pages source
to "GitHub Actions" and you're done. One thing to know: `base` in `vite.config.ts`
is `/phaedra/`, so change it if you rename the repo or move to a custom domain.
