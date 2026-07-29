import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Seo } from '@/components/Seo'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { useAuth } from '@/context/AuthContext'
import { fetchAllPosts } from '@/lib/posts'

export default function Dashboard() {
  const { user } = useAuth()
  const { data: posts, isLoading } = useQuery({
    queryKey: ['posts'],
    queryFn: fetchAllPosts,
  })

  const published = posts?.filter((p) => !p.is_draft).length ?? 0
  const drafts = posts?.filter((p) => p.is_draft).length ?? 0

  return (
    <>
      <Seo title="Dashboard" />
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <Button asChild>
          <Link to="/admin/new">New post</Link>
        </Button>
      </div>
      <p className="mb-6 text-sm text-muted-foreground">
        Signed in as {user?.email}
      </p>

      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Published
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-10" />
            ) : (
              <p className="text-3xl font-bold">{published}</p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Drafts
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-10" />
            ) : (
              <p className="text-3xl font-bold">{drafts}</p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 flex gap-3">
        <Button asChild variant="outline">
          <Link to="/admin/posts">Manage posts</Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="/admin/account">Account</Link>
        </Button>
      </div>
    </>
  )
}
