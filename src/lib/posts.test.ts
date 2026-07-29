import { describe, it, expect, beforeEach, vi } from 'vitest'

// Mock the supabase module: treat it as "not configured" so public reads
// short-circuit, and capture functions.invoke for the write path.
const { invoke, from } = vi.hoisted(() => ({ invoke: vi.fn(), from: vi.fn() }))
vi.mock('./supabase', () => ({
  supabase: { functions: { invoke }, from },
  isSupabaseConfigured: false,
}))

import {
  fetchPublishedPosts,
  fetchPublishedPostBySlug,
  savePost,
  deletePost,
} from './posts'

const input = {
  title: 't',
  slug: 't',
  content: 'c',
  is_draft: false,
  cover_image_path: null,
  image_caption: null,
  preview: null,
}

describe('posts data layer', () => {
  beforeEach(() => {
    invoke.mockReset()
    from.mockReset()
  })

  it('short-circuits public reads when supabase is unconfigured', async () => {
    expect(await fetchPublishedPosts()).toEqual([])
    expect(await fetchPublishedPostBySlug('x')).toBeNull()
    expect(from).not.toHaveBeenCalled()
  })

  it('savePost invokes the save-post function', async () => {
    invoke.mockResolvedValue({ data: { id: '1' }, error: null })
    const res = await savePost(input)
    expect(invoke).toHaveBeenCalledWith(
      'save-post',
      expect.objectContaining({
        body: expect.objectContaining({ title: 't' }),
      }),
    )
    expect(res).toEqual({ id: '1' })
  })

  it('deletePost invokes the delete-post function', async () => {
    invoke.mockResolvedValue({ data: null, error: null })
    await deletePost('abc')
    expect(invoke).toHaveBeenCalledWith('delete-post', { body: { id: 'abc' } })
  })

  it('savePost throws when the function errors', async () => {
    invoke.mockResolvedValue({ data: null, error: new Error('nope') })
    await expect(savePost(input)).rejects.toThrow('nope')
  })
})
