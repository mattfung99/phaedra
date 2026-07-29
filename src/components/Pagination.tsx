import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PaginationProps {
  page: number
  pageCount: number
}

// Lightweight pagination (plain links + lucide, no radix) so /blog stays out of
// the radix chunk. Page 1 uses a clean URL (no ?page).
export function Pagination({ page, pageCount }: PaginationProps) {
  if (pageCount <= 1) return null

  const item =
    'inline-flex h-9 min-w-9 items-center justify-center rounded-md border px-3 text-sm transition-colors hover:bg-accent hover:text-accent-foreground'
  const to = (p: number) => ({ search: p <= 1 ? '' : `?page=${p}` })

  return (
    <nav
      aria-label="Pagination"
      className="mt-8 flex items-center justify-center gap-1"
    >
      <Link
        to={to(page - 1)}
        aria-label="Previous page"
        aria-disabled={page <= 1}
        className={cn(item, page <= 1 && 'pointer-events-none opacity-50')}
      >
        <ChevronLeft className="size-4" />
      </Link>
      {Array.from({ length: pageCount }, (_, i) => i + 1).map((p) => (
        <Link
          key={p}
          to={to(p)}
          aria-current={p === page ? 'page' : undefined}
          className={cn(
            item,
            p === page && 'bg-primary text-primary-foreground hover:bg-primary',
          )}
        >
          {p}
        </Link>
      ))}
      <Link
        to={to(page + 1)}
        aria-label="Next page"
        aria-disabled={page >= pageCount}
        className={cn(
          item,
          page >= pageCount && 'pointer-events-none opacity-50',
        )}
      >
        <ChevronRight className="size-4" />
      </Link>
    </nav>
  )
}
