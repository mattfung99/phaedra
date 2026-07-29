import { useLoaderData, Link, type LoaderFunctionArgs } from 'react-router-dom'
import { Seo } from '@/components/Seo'
import { coverImageUrl } from '@/lib/supabase'
import { sanitizeHtml } from '@/lib/sanitize'
import { fetchPublishedPostBySlug } from '@/lib/posts'
import type { Post as PostType } from '@/lib/types'

export async function loader({ params }: LoaderFunctionArgs) {
  const post = params.slug
    ? await fetchPublishedPostBySlug(params.slug).catch(() => null)
    : null
  return { post }
}

export default function Post() {
  // For slugs not pre-rendered at build, the static loader yields null — so guard
  // against loader data being absent entirely, not just { post: null }.
  const data = useLoaderData() as { post: PostType | null } | null
  const post = data?.post ?? null

  if (!post) {
    return (
      <div className="py-16 text-center">
        <Seo title="Post not found" />
        <h1 className="text-2xl font-semibold">Post not found</h1>
        <Link
          to="/blog"
          className="mt-4 inline-block text-muted-foreground hover:text-foreground"
        >
          ← Back to blog
        </Link>
      </div>
    )
  }

  const img = coverImageUrl(post.cover_image_path)
  const jsonLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    datePublished: post.published_at ?? undefined,
    dateModified: post.updated_at,
    author: { '@type': 'Person', name: post.author_name },
    description: post.preview ?? undefined,
    image: img ?? undefined,
  }

  return (
    <article>
      <Seo
        title={post.title}
        description={post.preview}
        image={img}
        jsonLd={jsonLd}
      />
      <h1 className="text-3xl font-bold tracking-tight">{post.title}</h1>
      <div className="mt-2 text-sm text-muted-foreground">
        By {post.author_name}
        {post.published_at && (
          <>
            {' · '}
            <time dateTime={post.published_at}>
              {new Date(post.published_at).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>
          </>
        )}
      </div>

      {img && (
        <figure className="mt-6">
          <img
            src={img}
            alt={post.image_caption ?? ''}
            className="aspect-video w-full rounded-lg object-cover"
          />
          {post.image_caption && (
            <figcaption className="mt-2 text-center text-sm text-muted-foreground">
              {post.image_caption}
            </figcaption>
          )}
        </figure>
      )}

      {/* Content is sanitized at build (SSG) and on the client via isomorphic-dompurify. */}
      <div
        className="post-content mt-8"
        dangerouslySetInnerHTML={{ __html: sanitizeHtml(post.content) }}
      />
    </article>
  )
}
