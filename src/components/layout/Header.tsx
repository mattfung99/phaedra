import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { ThemeToggle } from '@/components/ThemeToggle'
import { cn } from '@/lib/utils'

const navLink = ({ isActive }: { isActive: boolean }) =>
  cn(
    'text-sm transition-colors hover:text-foreground',
    isActive ? 'text-foreground font-medium' : 'text-muted-foreground',
  )

export function Header() {
  const { session, signOut } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  return (
    <header className="border-b">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4">
        <Link to="/" className="text-lg font-semibold tracking-tight">
          Phaedra
        </Link>
        <nav className="flex items-center gap-5">
          <NavLink to="/" end className={navLink}>
            Home
          </NavLink>
          <NavLink to="/blog" className={navLink}>
            Blog
          </NavLink>
          <NavLink to="/about" className={navLink}>
            About
          </NavLink>
          <NavLink to="/contact" className={navLink}>
            Contact
          </NavLink>
          {session ? (
            <>
              <NavLink to="/admin" className={navLink}>
                Admin
              </NavLink>
              <button
                type="button"
                onClick={handleSignOut}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                Sign out
              </button>
            </>
          ) : (
            <NavLink to="/login" className={navLink}>
              Login
            </NavLink>
          )}
          <ThemeToggle />
        </nav>
      </div>
    </header>
  )
}
