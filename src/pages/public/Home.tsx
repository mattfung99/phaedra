import { useLoaderData, Link } from 'react-router-dom'
import { Seo } from '@/components/Seo'
import { PostCard } from '@/components/PostCard'
import { fetchPublishedPosts } from '@/lib/posts'

export async function loader() {
  const posts = await fetchPublishedPosts().catch(() => [])
  return { posts: posts.slice(0, 5) }
}

export default function Home() {
  const { posts } = useLoaderData() as Awaited<ReturnType<typeof loader>>

  return (
    <>
      <Seo title="Phaedra" description="A personal blog." />
      <section className="mb-10">
        <h1 className="text-4xl font-bold tracking-tight">Phaedra</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Writing on things worth writing down.
        </p>
      </section>

      <section>
        <div className="mb-4 flex items-baseline justify-between">
          <h2 className="text-lg font-semibold">Latest posts</h2>
          <Link
            to="/blog"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            View all →
          </Link>
        </div>
        {posts.length === 0 ? (
          <p className="text-muted-foreground">
            No posts yet. Check back soon.
          </p>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </section>
    </>
  )
}
