import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Seo } from '@/components/Seo'
import { PostForm } from '@/components/admin/PostForm'
import { PostSkeleton } from '@/components/skeletons'
import { fetchPostById } from '@/lib/posts'

export default function EditPost() {
  const { id } = useParams()
  const { data, isLoading, isError } = useQuery({
    queryKey: ['posts', id],
    queryFn: () => fetchPostById(id!),
    enabled: Boolean(id),
  })

  return (
    <>
      <Seo title="Edit post" />
      <h1 className="mb-6 text-2xl font-bold tracking-tight">Edit post</h1>
      {isLoading ? (
        <PostSkeleton />
      ) : isError || !data ? (
        <p className="text-muted-foreground">Post not found.</p>
      ) : (
        <PostForm initial={data} />
      )}
    </>
  )
}
