import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { PostCard } from './PostCard'
import type { Post } from '@/lib/types'

const post: Post = {
  id: '1',
  title: 'Hello World',
  slug: 'hello-world',
  author_name: 'Me',
  cover_image_path: null,
  image_caption: null,
  preview: 'A short preview',
  content: '<p>x</p>',
  is_draft: false,
  created_at: '2026-01-01T00:00:00Z',
  updated_at: '2026-01-01T00:00:00Z',
  published_at: '2026-01-02T00:00:00Z',
}

describe('PostCard', () => {
  it('renders the title and preview and links to the post', () => {
    render(
      <MemoryRouter>
        <PostCard post={post} />
      </MemoryRouter>,
    )
    expect(
      screen.getByRole('heading', { name: 'Hello World' }),
    ).toBeInTheDocument()
    expect(screen.getByText('A short preview')).toBeInTheDocument()
    expect(screen.getByRole('link')).toHaveAttribute(
      'href',
      '/blog/hello-world',
    )
  })
})
