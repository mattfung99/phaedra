import { Link } from 'react-router-dom'
import { Seo } from '@/components/Seo'

export default function NotFound() {
  return (
    <div className="py-16 text-center">
      <Seo title="Not found" />
      <h1 className="text-4xl font-bold tracking-tight">404</h1>
      <p className="mt-2 text-muted-foreground">
        This page could not be found.
      </p>
      <Link
        to="/"
        className="mt-4 inline-block text-muted-foreground hover:text-foreground"
      >
        ← Back home
      </Link>
    </div>
  )
}
