import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { makeQueryClient } from '@/lib/queryClient'

const { savePost, navigate } = vi.hoisted(() => ({
  savePost: vi.fn(),
  navigate: vi.fn(),
}))

vi.mock('@/lib/posts', () => ({ savePost }))
vi.mock('@/lib/storage', () => ({ uploadCoverImage: vi.fn() }))
vi.mock('sonner', () => ({ toast: { success: vi.fn(), error: vi.fn() } }))
vi.mock('react-router-dom', async (orig) => {
  const actual = (await orig()) as object
  return { ...actual, useNavigate: () => navigate }
})
// Stub the TipTap editor with a plain textarea so we can drive content in tests.
vi.mock('@/components/editor/TipTapEditor', () => ({
  TipTapEditor: ({
    value,
    onChange,
  }: {
    value: string
    onChange: (v: string) => void
  }) => (
    <textarea
      aria-label="content"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  ),
}))

import { PostForm } from './PostForm'

function renderForm() {
  return render(
    <MemoryRouter>
      <QueryClientProvider client={makeQueryClient()}>
        <PostForm />
      </QueryClientProvider>
    </MemoryRouter>,
  )
}

describe('PostForm', () => {
  beforeEach(() => {
    savePost.mockReset()
    navigate.mockReset()
  })

  it('derives the slug from the title', async () => {
    renderForm()
    await userEvent.type(screen.getByLabelText('Title'), 'My First Post')
    expect((screen.getByLabelText('Slug') as HTMLInputElement).value).toBe(
      'my-first-post',
    )
  })

  it('publishes with is_draft false', async () => {
    savePost.mockResolvedValue({ id: '1' })
    renderForm()
    await userEvent.type(screen.getByLabelText('Title'), 'Hello')
    await userEvent.type(screen.getByLabelText('content'), 'Body text')
    await userEvent.click(screen.getByRole('button', { name: 'Publish' }))
    await waitFor(() => expect(savePost).toHaveBeenCalled())
    expect(savePost.mock.calls[0][0]).toMatchObject({
      title: 'Hello',
      is_draft: false,
    })
  })

  it('saves a draft with is_draft true', async () => {
    savePost.mockResolvedValue({ id: '2' })
    renderForm()
    await userEvent.type(screen.getByLabelText('Title'), 'Draft')
    await userEvent.type(screen.getByLabelText('content'), 'Body')
    await userEvent.click(
      screen.getByRole('button', { name: /save as draft/i }),
    )
    await waitFor(() => expect(savePost).toHaveBeenCalled())
    expect(savePost.mock.calls[0][0]).toMatchObject({ is_draft: true })
  })
})
