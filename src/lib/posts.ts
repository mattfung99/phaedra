import { supabase, isSupabaseConfigured } from './supabase'
import type { Post, PostInput } from './types'

// Plain async data functions over supabase-js. Deliberately framework-agnostic so
// they can be used directly, or wrapped by TanStack Query in the admin area later.

/** Public list: published posts, newest first. RLS also enforces is_draft=false. */
export async function fetchPublishedPosts(): Promise<Post[]> {
  if (!isSupabaseConfigured) return []
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('is_draft', false)
    .order('published_at', { ascending: false })
  if (error) throw error
  return (data as Post[]) ?? []
}

/** Public single post by slug (published only). */
export async function fetchPublishedPostBySlug(
  slug: string,
): Promise<Post | null> {
  if (!isSupabaseConfigured) return null
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('slug', slug)
    .eq('is_draft', false)
    .maybeSingle()
  if (error) throw error
  return (data as Post) ?? null
}

/** Admin list: all posts including drafts (requires the authenticated select policy). */
export async function fetchAllPosts(): Promise<Post[]> {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .order('updated_at', { ascending: false })
  if (error) throw error
  return (data as Post[]) ?? []
}

/** Admin single post by id (may be a draft). */
export async function fetchPostById(id: string): Promise<Post | null> {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('id', id)
    .maybeSingle()
  if (error) throw error
  return (data as Post) ?? null
}

// Writes go through Edge Functions (service role) — never a direct table write —
// so the server sanitizes content and RLS can forbid client writes entirely.
// `id` present = update, absent = create; the function decides.
export async function savePost(
  input: PostInput & { id?: string },
): Promise<Post> {
  const { data, error } = await supabase.functions.invoke('save-post', {
    body: input,
  })
  if (error) throw error
  return data as Post
}

export async function deletePost(id: string): Promise<void> {
  const { error } = await supabase.functions.invoke('delete-post', {
    body: { id },
  })
  if (error) throw error
}

/**
 * Published slugs for SSG getStaticPaths. Tolerates failure (e.g. before the
 * Supabase project exists) so the build never breaks — it just pre-renders no
 * post pages until real data is reachable.
 */
export async function fetchPublishedSlugs(): Promise<string[]> {
  if (!isSupabaseConfigured) return []
  try {
    const { data, error } = await supabase
      .from('posts')
      .select('slug')
      .eq('is_draft', false)
    if (error) throw error
    return (data ?? []).map((r) => (r as { slug: string }).slug)
  } catch {
    return []
  }
}
