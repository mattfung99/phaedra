import { useLoaderData, useSearchParams } from 'react-router-dom'
import { Seo } from '@/components/Seo'
import { PostCard } from '@/components/PostCard'
import { Pagination } from '@/components/Pagination'
import { fetchPublishedPosts } from '@/lib/posts'

const PAGE_SIZE = 5

export async function loader() {
  const posts = await fetchPublishedPosts().catch(() => [])
  return { posts }
}

export default function Blog() {
  const { posts } = useLoaderData() as Awaited<ReturnType<typeof loader>>
  const [params] = useSearchParams()

  const pageCount = Math.max(1, Math.ceil(posts.length / PAGE_SIZE))
  const page = Math.min(Math.max(1, Number(params.get('page')) || 1), pageCount)
  const start = (page - 1) * PAGE_SIZE
  const visible = posts.slice(start, start + PAGE_SIZE)

  return (
    <>
      <Seo title="Blog" description="All posts from Phaedra." />
      <h1 className="mb-8 text-3xl font-bold tracking-tight">Blog</h1>
      {posts.length === 0 ? (
        <p className="text-muted-foreground">No posts yet. Check back soon.</p>
      ) : (
        <>
          <div className="space-y-6">
            {visible.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
          <Pagination page={page} pageCount={pageCount} />
        </>
      )}
    </>
  )
}
