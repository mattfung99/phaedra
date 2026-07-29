import { Skeleton } from '@/components/ui/skeleton'

/** Loading placeholder for a list of posts (blog list, dashboard). */
export function PostListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="space-y-2 border-b pb-6 last:border-b-0">
          <Skeleton className="aspect-video w-full rounded-lg" />
          <Skeleton className="h-6 w-2/3" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-3 w-24" />
        </div>
      ))}
    </div>
  )
}

/** Loading placeholder for a single post page. */
export function PostSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-10 w-3/4" />
      <Skeleton className="h-4 w-32" />
      <Skeleton className="aspect-video w-full rounded-lg" />
      <div className="space-y-2 pt-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </div>
    </div>
  )
}

/** Loading placeholder for the admin posts table. */
export function PostTableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4">
          <Skeleton className="h-5 flex-1" />
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-8 w-16" />
        </div>
      ))}
    </div>
  )
}
