import { createClient } from '@supabase/supabase-js'

// The anon key is PUBLIC by design — it ships in the client bundle. Security is
// enforced server-side by Postgres Row Level Security, never by hiding this key.
// Real values come from .env.local locally and from repo secrets in CI at build time.
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string

// False when running against the placeholder .env (i.e. before the real Supabase
// project exists). Lets SSG loaders short-circuit so the build never hangs on a
// network call to a non-existent host.
export const isSupabaseConfigured =
  !!SUPABASE_URL && !SUPABASE_URL.includes('placeholder')

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

export const POST_IMAGES_BUCKET = 'post-images'

/** Public URL for a Storage object path stored in posts.cover_image_path. */
export function coverImageUrl(path: string | null): string | null {
  if (!path) return null
  return supabase.storage.from(POST_IMAGES_BUCKET).getPublicUrl(path).data
    .publicUrl
}
