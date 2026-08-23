import type { Metadata } from "next"
import { headers } from "next/headers"
import Link from "next/link"
import { Compass } from "lucide-react"

import { HomeButton } from "@/components/shared/home-button"
import { Button } from "@/components/ui/button"
import { homeFor, PATHNAME_HEADER } from "@/lib/home"
import { ROUTES } from "@/lib/routes"

export const metadata: Metadata = {
  title: "Page not found",
  description: "The page you were looking for does not exist on MyKaggo.",
  robots: { index: false, follow: false },
}

/**
 * Global 404. Rendered inside the root layout, so it keeps the app shell.
 *
 * The requested path comes from the header the proxy stamps rather than from
 * `usePathname()`: Next renders the `/_not-found` segment for unmatched URLs,
 * so the router would report that instead of what the visitor typed — and the
 * escape hatch would send a company user to the rider landing page.
 */
export default async function NotFound() {
  const requestHeaders = await headers()
  const pathname = requestHeaders.get(PATHNAME_HEADER) ?? ROUTES.home
  const isRiderArea = homeFor(pathname).href === ROUTES.home

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 px-6 py-16 text-center">
      <div className="flex size-19 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Compass className="size-10 stroke-[1.5]" />
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-[13px] font-semibold tracking-widest text-primary uppercase">
          Error 404
        </p>
        <h1 className="text-[24px] font-bold tracking-tight text-foreground">
          We can&rsquo;t find that page
        </h1>
        <p className="max-w-80 text-[14px] leading-relaxed text-foreground/70">
          The link may be broken, or the page may have been moved.
        </p>
      </div>

      <div className="flex w-full max-w-80 flex-col gap-3">
        <HomeButton variant="default" pathname={pathname} />
        {/* Tracking is a rider feature — not a useful next step for staff. */}
        {isRiderArea ? (
          <Button
            render={<Link href={ROUTES.track} />}
            nativeButton={false}
            variant="outline"
            size="lg"
            className="w-full rounded-full"
          >
            Track a package
          </Button>
        ) : null}
      </div>
    </div>
  )
}
