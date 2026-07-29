// Mirrors the `posts` table in supabase/migrations. Content is sanitized TipTap HTML.
export interface Post {
  id: string
  title: string
  slug: string
  author_name: string
  cover_image_path: string | null
  image_caption: string | null
  preview: string | null
  content: string
  is_draft: boolean
  created_at: string
  updated_at: string
  published_at: string | null
}

// Fields the editor sends on create/update. Server-owned fields (id, timestamps,
// author) are never accepted from the client — author comes from the auth session.
export type PostInput = Pick<
  Post,
  | 'title'
  | 'slug'
  | 'cover_image_path'
  | 'image_caption'
  | 'preview'
  | 'content'
  | 'is_draft'
>
