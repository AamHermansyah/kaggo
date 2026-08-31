"use client"

import { AlertTriangle, RefreshCw } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { cn } from "@/lib/utils"

export interface ErrorStateProps {
  title?: string
  description?: string
  /** Omitted when the failure is not worth retrying (e.g. a missing endpoint). */
  onRetry?: () => void
  retryLabel?: string
  className?: string
}

/**
 * Shared failure UI.
 *
 * Used by the component-level boundaries, by every `error.tsx`, and by inline
 * fetch failures, so a broken section always looks the same wherever it appears.
 */
export function ErrorState({
  title = "Could not load this section",
  description = "Something went wrong while fetching the data.",
  onRetry,
  retryLabel = "Try again",
  className,
}: ErrorStateProps) {
  return (
    <Empty
      role="alert"
      className={cn("border border-dashed border-border/70 bg-muted/30", className)}
    >
      <EmptyHeader>
        <EmptyMedia variant="icon" className="bg-destructive/10 text-destructive">
          <AlertTriangle />
        </EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription>{description}</EmptyDescription>
      </EmptyHeader>
      {onRetry ? (
        <EmptyContent>
          <Button variant="outline" size="sm" onClick={onRetry}>
            <RefreshCw data-icon="inline-start" />
            {retryLabel}
          </Button>
        </EmptyContent>
      ) : null}
    </Empty>
  )
}
