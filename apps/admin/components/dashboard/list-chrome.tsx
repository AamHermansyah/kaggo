import Link from "next/link"
import { ArrowLeft, ArrowRight, Inbox } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Skeleton } from "@/components/ui/skeleton"
import type { PaginationMeta } from "@/lib/api/http"

/** Section title plus the count line the designs put underneath it. */
export function ListHeader({
  title,
  subtitle,
}: {
  title: string
  subtitle?: string
}) {
  return (
    <div className="flex flex-col">
      <h1 className="text-[22px] font-semibold text-foreground">{title}</h1>
      {subtitle ? (
        <p className="mt-1 text-[15px] text-foreground/80">{subtitle}</p>
      ) : null}
    </div>
  )
}

export function ListEmpty({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <Empty className="border border-dashed border-border/70">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Inbox />
        </EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription>{description}</EmptyDescription>
      </EmptyHeader>
    </Empty>
  )
}

/**
 * Cursor pagination.
 *
 * The API is forward-only (it returns a `nextCursor` and nothing to walk
 * backwards with), so the control offers "next page" plus a jump back to the
 * start rather than pretending page numbers exist.
 */
export function CursorPager({
  basePath,
  pagination,
  params,
}: {
  basePath: string
  pagination: PaginationMeta | undefined
  params: { range: string; query: string; cursor?: string }
}) {
  const hasMore = Boolean(pagination?.hasMore && pagination.nextCursor)
  if (!hasMore && !params.cursor) return null

  function href(cursor?: string) {
    const search = new URLSearchParams()
    if (params.range !== "all") search.set("range", params.range)
    if (params.query) search.set("q", params.query)
    if (cursor) search.set("cursor", cursor)
    const query = search.toString()
    return query ? `${basePath}?${query}` : basePath
  }

  return (
    <div className="mt-8 flex items-center justify-between gap-3">
      {params.cursor ? (
        <Button
          render={<Link href={href()} />}
          nativeButton={false}
          variant="outline"
          size="sm"
          className="rounded-full"
        >
          <ArrowLeft data-icon="inline-start" />
          First page
        </Button>
      ) : (
        <span />
      )}

      {hasMore ? (
        <Button
          render={<Link href={href(pagination!.nextCursor!)} />}
          nativeButton={false}
          variant="outline"
          size="sm"
          className="rounded-full"
        >
          Next page
          <ArrowRight data-icon="inline-end" />
        </Button>
      ) : null}
    </div>
  )
}

export function ListSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-4 w-20" />
      </div>
      <div className="flex flex-col gap-5">
        {Array.from({ length: rows }).map((_, index) => (
          <div key={index} className="flex items-start justify-between gap-4">
            <div className="flex flex-col gap-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-3 w-28" />
            </div>
            <div className="flex flex-col items-end gap-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
