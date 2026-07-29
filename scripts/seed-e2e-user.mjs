// Seeds a (local) Supabase project for e2e tests, using the service-role key:
//  - a confirmed admin user (for the admin write-path test)
//  - one published post (so the SSG build pre-renders it and the public render
//    path can be tested)
// Idempotent. Run AFTER `supabase start` and BEFORE `npm run build`.
import { createClient } from '@supabase/supabase-js'

const url = process.env.SUPABASE_URL
const serviceRole = process.env.SUPABASE_SERVICE_ROLE
const email = process.env.E2E_ADMIN_EMAIL
const password = process.env.E2E_ADMIN_PASSWORD

if (!url || !serviceRole || !email || !password) {
  console.error(
    'Missing SUPABASE_URL / SUPABASE_SERVICE_ROLE / E2E_ADMIN_EMAIL / E2E_ADMIN_PASSWORD',
  )
  process.exit(1)
}

const admin = createClient(url, serviceRole)

const { error: userErr } = await admin.auth.admin.createUser({
  email,
  password,
  email_confirm: true,
  user_metadata: { author_name: 'E2E Admin' },
})
if (userErr && !/already|registered|exists/i.test(userErr.message)) {
  console.error('seed user failed:', userErr.message)
  process.exit(1)
}

// Published posts the build will pre-render. `e2e-welcome` is kept newest so the
// e2e assertions (see e2e/public-post.spec.ts) stay stable; the rest give local
// dev a populated blog list + pagination. `daysAgo` orders them.
const now = Date.now()
const samples = [
  {
    title: 'E2E Welcome',
    slug: 'e2e-welcome',
    preview: 'Seeded published post.',
    content: '<p>Welcome from the e2e suite.</p>',
    daysAgo: 0,
  },
  ...Array.from({ length: 5 }, (_, i) => ({
    title: `Sample Post ${i + 1}`,
    slug: `sample-post-${i + 1}`,
    preview: `Sample post number ${i + 1} for local development.`,
    content: `<p>This is sample post ${i + 1}.</p><p>Replace or delete it.</p>`,
    daysAgo: i + 1,
  })),
]

const { error: postErr } = await admin.from('posts').upsert(
  samples.map((s) => ({
    title: s.title,
    slug: s.slug,
    author_name: 'E2E Admin',
    content: s.content,
    preview: s.preview,
    is_draft: false,
    published_at: new Date(now - s.daysAgo * 86_400_000).toISOString(),
  })),
  { onConflict: 'slug' },
)
if (postErr) {
  console.error('seed posts failed:', postErr.message)
  process.exit(1)
}

console.log(`seeded admin user + ${samples.length} published posts`)
