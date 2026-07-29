import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import AuthGuard from './AuthGuard'

const mockAuth = vi.hoisted(() => ({
  session: null as unknown,
  loading: true,
}))
vi.mock('@/context/AuthContext', () => ({ useAuth: () => mockAuth }))

function renderGuard() {
  return render(
    <MemoryRouter initialEntries={['/admin']}>
      <Routes>
        <Route path="/admin" element={<AuthGuard />}>
          <Route index element={<div>Admin Home</div>} />
        </Route>
        <Route path="/login" element={<div>Login Page</div>} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('AuthGuard', () => {
  it('shows a loading state while resolving the session', () => {
    mockAuth.session = null
    mockAuth.loading = true
    renderGuard()
    expect(screen.getByText(/loading/i)).toBeInTheDocument()
  })

  it('redirects to /login when unauthenticated', () => {
    mockAuth.session = null
    mockAuth.loading = false
    renderGuard()
    expect(screen.getByText('Login Page')).toBeInTheDocument()
  })

  it('renders the child route when authenticated', () => {
    mockAuth.session = { user: {} }
    mockAuth.loading = false
    renderGuard()
    expect(screen.getByText('Admin Home')).toBeInTheDocument()
  })
})
