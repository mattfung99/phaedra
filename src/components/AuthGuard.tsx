import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'

// Client-side gate for /admin/*. During SSG pre-render `loading` is true, so the
// server emits a neutral loading shell (no data); the client resolves the session
// and redirects unauthenticated visitors to /login.
export default function AuthGuard() {
  const { session, loading } = useAuth()
  if (loading) {
    return (
      <div className="py-16 text-center text-muted-foreground">Loading…</div>
    )
  }
  if (!session) {
    return <Navigate to="/login" replace />
  }
  return <Outlet />
}
