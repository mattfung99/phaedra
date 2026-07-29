// Service-role export of posts + auth users, written to backup/ for the Backup
// workflow to upload as a retained artifact.
import { createClient } from '@supabase/supabase-js'
import { mkdirSync, writeFileSync } from 'node:fs'

const url = process.env.SUPABASE_URL
const serviceRole = process.env.SUPABASE_SERVICE_ROLE
if (!url || !serviceRole) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE')
  process.exit(1)
}

const admin = createClient(url, serviceRole)

const { data: posts, error: postsError } = await admin.from('posts').select('*')
if (postsError) throw postsError

const { data: usersData, error: usersError } =
  await admin.auth.admin.listUsers()
if (usersError) throw usersError

mkdirSync('backup', { recursive: true })
const stamp = new Date().toISOString().slice(0, 10)
writeFileSync(`backup/posts-${stamp}.json`, JSON.stringify(posts, null, 2))
writeFileSync(
  `backup/users-${stamp}.json`,
  JSON.stringify(
    usersData.users.map((u) => ({
      id: u.id,
      email: u.email,
      created_at: u.created_at,
    })),
    null,
    2,
  ),
)
console.log(`backup: ${posts.length} posts, ${usersData.users.length} users`)
