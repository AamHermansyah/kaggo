"use client"

import { useEffect, useRef, useState, useTransition } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Search } from "lucide-react"

import { Spinner } from "@/components/ui/spinner"
import type { RangeFilter } from "@/lib/api/types"
import { cn } from "@/lib/utils"

const RANGES: Array<{ value: RangeFilter; label: string }> = [
  { value: "today", label: "Today" },
  { value: "week", label: "This Week" },
  { value: "month", label: "This Month" },
  { value: "all", label: "All" },
]

/**
 * Search box and date-range switch.
 *
 * Both write to the URL rather than to component state, so the server
 * re-renders with the new parameters and the view is shareable and
 * back-button friendly.
 *
 * The admin API has no search parameter, so `?q=` filters the rows already
 * loaded for the current page — the placeholder says so rather than implying a
 * full-database search.
 */
export function AdminToolbar({
  range,
  query,
  searchPlaceholder = "Search this page",
}: {
  range: RangeFilter
  query: string
  searchPlaceholder?: string
}) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [value, setValue] = useState(query)
  const [syncedQuery, setSyncedQuery] = useState(query)
  const [pending, startTransition] = useTransition()
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  // Re-sync the box when the URL changes from elsewhere (back button).
  // Adjusting state during render is React's recommended alternative to a
  // setState-in-effect here: it re-renders before the browser paints, so the
  // stale value is never shown.
  if (query !== syncedQuery) {
    setSyncedQuery(query)
    setValue(query)
  }

  useEffect(() => () => clearTimeout(timer.current), [])

  function push(next: URLSearchParams) {
    // A new search or range invalidates the current cursor page.
    next.delete("cursor")
    const search = next.toString()
    startTransition(() => {
      router.replace(search ? `${pathname}?${search}` : pathname, {
        scroll: false,
      })
    })
  }

  function onSearchChange(nextValue: string) {
    setValue(nextValue)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => {
      const next = new URLSearchParams(searchParams)
      if (nextValue.trim()) next.set("q", nextValue.trim())
      else next.delete("q")
      push(next)
    }, 350)
  }

  function onRangeChange(nextRange: RangeFilter) {
    const next = new URLSearchParams(searchParams)
    if (nextRange === "all") next.delete("range")
    else next.set("range", nextRange)
    push(next)
  }

  return (
    <div className="mb-8 flex items-center justify-between gap-4">
      <div className="relative max-w-35 flex-1">
        <label htmlFor="admin-search" className="sr-only">
          {searchPlaceholder}
        </label>
        {pending ? (
          <Spinner className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        ) : (
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        )}
        <input
          id="admin-search"
          type="search"
          value={value}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search"
          className="h-9 w-full rounded-full border bg-transparent pr-3 pl-9 text-[14px] outline-none focus:border-primary/50"
        />
      </div>

      <div
        role="group"
        aria-label="Date range"
        className="flex shrink-0 items-center gap-3 text-[13px] font-medium"
      >
        {RANGES.map((option) => (
          <button
            key={option.value}
            type="button"
            aria-pressed={range === option.value}
            onClick={() => onRangeChange(option.value)}
            className={cn(
              "transition-colors",
              range === option.value
                ? "text-primary"
                : "text-foreground/50 hover:text-foreground/80"
            )}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  )
}
