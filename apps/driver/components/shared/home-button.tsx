"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { Button } from "@/components/ui/button"
import { homeFor, isAtHome } from "@/lib/home"
import { cn } from "@/lib/utils"

/**
 * Escape hatch shown on error, 404 and offline screens.
 *
 * Renders nothing when the visitor is already on their home page — a button
 * that navigates to the page you are looking at is noise. The destination
 * follows the portal the visitor is in (rider, company or admin), so company
 * staff are not dumped onto the rider landing page.
 */
export function HomeButton({
  className,
  variant = "outline",
  size = "lg",
  pathname: explicitPathname,
}: {
  className?: string
  variant?: React.ComponentProps<typeof Button>["variant"]
  size?: React.ComponentProps<typeof Button>["size"]
  /**
   * Overrides the router pathname. Needed inside `not-found.tsx`, where Next
   * renders the `/_not-found` segment and `usePathname()` therefore reports
   * that instead of the URL the visitor asked for.
   */
  pathname?: string
}) {
  const routerPathname = usePathname()
  const pathname = explicitPathname ?? routerPathname ?? "/"

  if (isAtHome(pathname)) return null

  const target = homeFor(pathname)

  return (
    <Button
      render={<Link href={target.href} />}
      nativeButton={false}
      variant={variant}
      size={size}
      className={cn("w-full rounded-full", className)}
    >
      {target.label}
    </Button>
  )
}
