import { Link } from 'react-router-dom'
import type { Post } from '@/lib/types'
import { coverImageUrl } from '@/lib/supabase'

export function PostCard({ post }: { post: Post }) {
  const img = coverImageUrl(post.cover_image_path)
  return (
    <article className="group border-b pb-6 last:border-b-0">
      <Link to={`/blog/${post.slug}`} className="block">
        {img && (
          <img
            src={img}
            alt={post.image_caption ?? ''}
            className="mb-3 aspect-video w-full rounded-lg object-cover"
          />
        )}
        <h2 className="text-xl font-semibold tracking-tight group-hover:underline">
          {post.title}
        </h2>
        {post.preview && (
          <p className="mt-1 text-muted-foreground">{post.preview}</p>
        )}
        {post.published_at && (
          <time
            dateTime={post.published_at}
            className="mt-2 block text-xs text-muted-foreground"
          >
            {new Date(post.published_at).toLocaleDateString(undefined, {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </time>
        )}
      </Link>
    </article>
  )
}
