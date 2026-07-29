import { Seo } from '@/components/Seo'
import { PostForm } from '@/components/admin/PostForm'

export default function NewPost() {
  return (
    <>
      <Seo title="New post" />
      <h1 className="mb-6 text-2xl font-bold tracking-tight">New post</h1>
      <PostForm />
    </>
  )
}
