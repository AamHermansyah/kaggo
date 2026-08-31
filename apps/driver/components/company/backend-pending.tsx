import Link from "next/link"
import { Construction } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"

/**
 * Honest placeholder for company screens whose endpoint the backend has not
 * shipped.
 *
 * The company service exposes only `auth/register`, `auth/login`,
 * `auth/profile`, `dashboard` and `batches`; batch creation, driver assignment,
 * the package list and vehicle management return 404. Rendering a form that
 * always fails would be worse than saying so — the client code for each of
 * these is already written against the natural REST shape and starts working as
 * soon as the route exists. See .documentations/README-INTEGRATION.md.
 */
export function BackendPending({
  title,
  description,
  backHref,
  backLabel = "Back",
}: {
  title: string
  description: string
  backHref: string
  backLabel?: string
}) {
  return (
    <Empty className="border border-dashed border-border/70">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Construction />
        </EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription>{description}</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button
          render={<Link href={backHref} />}
          nativeButton={false}
          variant="outline"
          size="sm"
          className="rounded-full"
        >
          {backLabel}
        </Button>
      </EmptyContent>
    </Empty>
  )
}
