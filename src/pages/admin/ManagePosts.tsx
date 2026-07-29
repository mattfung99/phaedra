import { Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Seo } from '@/components/Seo'
import { PostTableSkeleton } from '@/components/skeletons'
import { Button } from '@/components/ui/button'
import { fetchAllPosts, deletePost } from '@/lib/posts'

export default function ManagePosts() {
  const queryClient = useQueryClient()
  const { data: posts, isLoading } = useQuery({
    queryKey: ['posts'],
    queryFn: fetchAllPosts,
  })

  const del = useMutation({
    mutationFn: deletePost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
      toast.success('Post deleted')
    },
    onError: (err: unknown) =>
      toast.error(err instanceof Error ? err.message : 'Failed to delete'),
  })

  const onDelete = (id: string, title: string) => {
    if (window.confirm(`Delete “${title}”? This cannot be undone.`)) {
      del.mutate(id)
    }
  }

  return (
    <>
      <Seo title="Manage posts" />
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Manage posts</h1>
        <Button asChild>
          <Link to="/admin/new">New post</Link>
        </Button>
      </div>

      {isLoading ? (
        <PostTableSkeleton />
      ) : !posts || posts.length === 0 ? (
        <p className="text-muted-foreground">No posts yet.</p>
      ) : (
        <ul className="divide-y">
          {posts.map((post) => (
            <li key={post.id} className="flex items-center gap-3 py-3">
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">{post.title}</p>
                <p className="text-xs text-muted-foreground">
                  /blog/{post.slug}
                </p>
              </div>
              <span
                className={
                  post.is_draft
                    ? 'rounded bg-secondary px-2 py-0.5 text-xs text-secondary-foreground'
                    : 'rounded bg-primary px-2 py-0.5 text-xs text-primary-foreground'
                }
              >
                {post.is_draft ? 'Draft' : 'Published'}
              </span>
              <Button asChild variant="outline" size="sm">
                <Link to={`/admin/edit/${post.id}`}>Edit</Link>
              </Button>
              <Button
                variant="destructive"
                size="sm"
                disabled={del.isPending}
                onClick={() => onDelete(post.id, post.title)}
              >
                Delete
              </Button>
            </li>
          ))}
        </ul>
      )}
    </>
  )
}
