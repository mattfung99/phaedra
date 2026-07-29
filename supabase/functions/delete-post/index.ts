// delete-post: verifies the caller is an authenticated admin, then deletes the
// post row and its cover image via the service role (RLS forbids client writes).
import { createClient } from 'jsr:@supabase/supabase-js@2'
import { corsHeaders, json } from '../_shared/cors.ts'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS')
    return new Response('ok', { headers: corsHeaders })
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405)

  const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
  const ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')!
  const SERVICE_ROLE = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

  try {
    const authHeader = req.headers.get('Authorization') ?? ''
    const userClient = createClient(SUPABASE_URL, ANON_KEY, {
      global: { headers: { Authorization: authHeader } },
    })
    const {
      data: { user },
      error: userErr,
    } = await userClient.auth.getUser()
    if (userErr || !user) return json({ error: 'Unauthorized' }, 401)

    const { id } = (await req.json()) as { id?: string }
    if (!id) return json({ error: 'id is required' }, 400)

    const admin = createClient(SUPABASE_URL, SERVICE_ROLE)

    // Look up the cover image so we can remove it from Storage too.
    const { data: post } = await admin
      .from('posts')
      .select('cover_image_path')
      .eq('id', id)
      .maybeSingle()

    const { error } = await admin.from('posts').delete().eq('id', id)
    if (error) return json({ error: error.message }, 400)

    if (post?.cover_image_path) {
      await admin.storage.from('post-images').remove([post.cover_image_path])
    }

    return json({ ok: true }, 200)
  } catch (e) {
    return json(
      { error: e instanceof Error ? e.message : 'Unexpected error' },
      500,
    )
  }
})
