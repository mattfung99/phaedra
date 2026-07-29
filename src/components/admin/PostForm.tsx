import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { savePost } from '@/lib/posts'
import { uploadCoverImage } from '@/lib/storage'
import { slugify } from '@/lib/slug'
import { coverImageUrl } from '@/lib/supabase'
import type { Post } from '@/lib/types'
import { TipTapEditor } from '@/components/editor/TipTapEditor'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

export function PostForm({ initial }: { initial?: Post }) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const [title, setTitle] = useState(initial?.title ?? '')
  const [slug, setSlug] = useState(initial?.slug ?? '')
  const [slugEdited, setSlugEdited] = useState(Boolean(initial))
  const [imageCaption, setImageCaption] = useState(initial?.image_caption ?? '')
  const [preview, setPreview] = useState(initial?.preview ?? '')
  const [content, setContent] = useState(initial?.content ?? '')
  const [coverPath, setCoverPath] = useState<string | null>(
    initial?.cover_image_path ?? null,
  )
  const [uploading, setUploading] = useState(false)

  const mutation = useMutation({
    mutationFn: (isDraft: boolean) =>
      savePost({
        id: initial?.id,
        title: title.trim(),
        slug: (slug || slugify(title)).trim(),
        cover_image_path: coverPath,
        image_caption: imageCaption.trim() || null,
        preview: preview.trim() || null,
        content,
        is_draft: isDraft,
      }),
    onSuccess: (_data, isDraft) => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
      toast.success(isDraft ? 'Draft saved' : 'Post published')
      navigate('/admin/posts')
    },
    onError: (err: unknown) =>
      toast.error(err instanceof Error ? err.message : 'Failed to save'),
  })

  const onTitleChange = (value: string) => {
    setTitle(value)
    if (!slugEdited) setSlug(slugify(value))
  }

  const onCoverChange = async (file: File | undefined) => {
    if (!file) return
    setUploading(true)
    try {
      const path = await uploadCoverImage(file)
      setCoverPath(path)
      toast.success('Cover image uploaded')
    } catch {
      toast.error('Image upload failed')
    } finally {
      setUploading(false)
    }
  }

  const canSubmit =
    title.trim().length > 0 &&
    content.trim().length > 0 &&
    !mutation.isPending &&
    !uploading

  const coverUrl = coverImageUrl(coverPath)

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-6"
      aria-busy={mutation.isPending}
    >
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="Post title"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="slug">Slug</Label>
        <Input
          id="slug"
          value={slug}
          onChange={(e) => {
            setSlug(slugify(e.target.value))
            setSlugEdited(true)
          }}
          placeholder="post-title"
        />
        <p className="text-xs text-muted-foreground">
          URL: /blog/{slug || slugify(title) || '…'}
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="cover">Cover image</Label>
        <Input
          id="cover"
          type="file"
          accept="image/png,image/jpeg,image/webp"
          onChange={(e) => onCoverChange(e.target.files?.[0])}
        />
        {coverUrl && (
          <img
            src={coverUrl}
            alt=""
            className="mt-2 aspect-video w-full max-w-sm rounded-lg object-cover"
          />
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="caption">Image caption</Label>
        <Input
          id="caption"
          value={imageCaption}
          onChange={(e) => setImageCaption(e.target.value)}
          placeholder="Optional caption"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="preview">Preview</Label>
        <Textarea
          id="preview"
          value={preview}
          onChange={(e) => setPreview(e.target.value)}
          placeholder="Short summary shown in lists"
          rows={2}
        />
      </div>

      <div className="space-y-2">
        <Label>Content</Label>
        <TipTapEditor value={content} onChange={setContent} />
      </div>

      <div className="flex gap-3">
        <Button
          type="button"
          disabled={!canSubmit}
          onClick={() => mutation.mutate(false)}
        >
          {mutation.isPending ? 'Saving…' : 'Publish'}
        </Button>
        <Button
          type="button"
          variant="secondary"
          disabled={!canSubmit}
          onClick={() => mutation.mutate(true)}
        >
          Save as draft
        </Button>
      </div>
    </form>
  )
}
