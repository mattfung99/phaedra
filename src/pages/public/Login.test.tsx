import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'

const { signIn, navigate, toastError } = vi.hoisted(() => ({
  signIn: vi.fn(),
  navigate: vi.fn(),
  toastError: vi.fn(),
}))

vi.mock('@/context/AuthContext', () => ({
  useAuth: () => ({ session: null, loading: false, signIn }),
}))
vi.mock('react-router-dom', async (orig) => {
  const actual = (await orig()) as object
  return { ...actual, useNavigate: () => navigate }
})
vi.mock('sonner', () => ({ toast: { error: toastError, success: vi.fn() } }))
// Seo renders vite-react-ssg's <Head>, which needs a HelmetProvider we don't set
// up in unit tests and which is irrelevant to the form logic.
vi.mock('@/components/Seo', () => ({ Seo: () => null }))

import Login from './Login'

describe('Login', () => {
  beforeEach(() => {
    signIn.mockReset()
    navigate.mockReset()
    toastError.mockReset()
  })

  it('signs in and navigates to /admin on success', async () => {
    signIn.mockResolvedValue({ error: null })
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>,
    )
    await userEvent.type(screen.getByLabelText(/email/i), 'a@b.com')
    await userEvent.type(screen.getByLabelText(/password/i), 'secret12')
    await userEvent.click(screen.getByRole('button', { name: /sign in/i }))
    expect(signIn).toHaveBeenCalledWith('a@b.com', 'secret12')
    expect(navigate).toHaveBeenCalledWith('/admin', { replace: true })
  })

  it('toasts the error on failure', async () => {
    signIn.mockResolvedValue({ error: 'bad creds' })
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>,
    )
    await userEvent.type(screen.getByLabelText(/email/i), 'a@b.com')
    await userEvent.type(screen.getByLabelText(/password/i), 'x')
    await userEvent.click(screen.getByRole('button', { name: /sign in/i }))
    expect(toastError).toHaveBeenCalledWith('bad creds')
  })
})
