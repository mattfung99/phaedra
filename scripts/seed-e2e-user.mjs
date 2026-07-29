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

// Public post the build will pre-render (see e2e/public-post.spec.ts).
const { error: postErr } = await admin.from('posts').upsert(
  {
    title: 'E2E Welcome',
    slug: 'e2e-welcome',
    author_name: 'E2E Admin',
    content: '<p>Welcome from the e2e suite.</p>',
    preview: 'Seeded published post.',
    is_draft: false,
    published_at: new Date().toISOString(),
  },
  { onConflict: 'slug' },
)
if (postErr) {
  console.error('seed post failed:', postErr.message)
  process.exit(1)
}

console.log('seeded e2e admin user + published post')
