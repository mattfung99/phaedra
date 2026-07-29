// save-post: the ONLY write path for creating/updating posts.
// 1. verifies the caller is an authenticated admin (JWT),
// 2. server-sanitizes the HTML content (sanitize-html — no DOM needed),
// 3. upserts via the service role (RLS forbids client writes), deriving author
//    from the session so it can never be spoofed by the client.
import { createClient } from 'jsr:@supabase/supabase-js@2'
import { corsHeaders, json } from '../_shared/cors.ts'
import { sanitizePostContent } from '../_shared/sanitize.ts'

interface PostBody {
  id?: string
  title?: string
  slug?: string
  cover_image_path?: string | null
  image_caption?: string | null
  preview?: string | null
  content?: string
  is_draft?: boolean
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS')
    return new Response('ok', { headers: corsHeaders })
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405)

  const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
  const ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')!
  const SERVICE_ROLE = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

  try {
    // Verify the caller's identity from their JWT.
    const authHeader = req.headers.get('Authorization') ?? ''
    const userClient = createClient(SUPABASE_URL, ANON_KEY, {
      global: { headers: { Authorization: authHeader } },
    })
    const {
      data: { user },
      error: userErr,
    } = await userClient.auth.getUser()
    if (userErr || !user) return json({ error: 'Unauthorized' }, 401)

    const body = (await req.json()) as PostBody
    if (
      !body.title?.trim() ||
      !body.slug?.trim() ||
      typeof body.content !== 'string'
    ) {
      return json({ error: 'title, slug and content are required' }, 400)
    }

    const cleanContent = sanitizePostContent(body.content)
    const authorName =
      (user.user_metadata?.author_name as string | undefined) ??
      (user.user_metadata?.name as string | undefined) ??
      user.email ??
      'Author'

    const admin = createClient(SUPABASE_URL, SERVICE_ROLE)
    const nowIso = new Date().toISOString()

    const base = {
      title: body.title.trim(),
      slug: body.slug.trim(),
      cover_image_path: body.cover_image_path ?? null,
      image_caption: body.image_caption ?? null,
      preview: body.preview ?? null,
      content: cleanContent,
      is_draft: Boolean(body.is_draft),
      author_name: authorName,
    }

    if (body.id) {
      // Preserve the original publish date; set it the first time it goes live.
      const { data: existing } = await admin
        .from('posts')
        .select('published_at')
        .eq('id', body.id)
        .maybeSingle()
      const published_at = base.is_draft
        ? (existing?.published_at ?? null)
        : (existing?.published_at ?? nowIso)

      const { data, error } = await admin
        .from('posts')
        .update({ ...base, published_at })
        .eq('id', body.id)
        .select()
        .single()
      if (error) return json({ error: error.message }, 400)
      return json(data, 200)
    }

    const { data, error } = await admin
      .from('posts')
      .insert({ ...base, published_at: base.is_draft ? null : nowIso })
      .select()
      .single()
    if (error) return json({ error: error.message }, 400)
    return json(data, 200)
  } catch (e) {
    return json(
      { error: e instanceof Error ? e.message : 'Unexpected error' },
      500,
    )
  }
})
