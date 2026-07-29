import { supabase, POST_IMAGES_BUCKET } from './supabase'

// Upload a cover image and return its Storage path (stored in posts.cover_image_path).
// The filename is a random UUID + extension only — never the user-supplied name —
// which sidesteps the path/filename-injection smell the old multer code had.
export async function uploadCoverImage(file: File): Promise<string> {
  const ext = (file.name.split('.').pop() ?? 'bin').toLowerCase()
  const path = `${crypto.randomUUID()}.${ext}`
  const { error } = await supabase.storage
    .from(POST_IMAGES_BUCKET)
    .upload(path, file, { cacheControl: '3600', upsert: false })
  if (error) throw error
  return path
}
