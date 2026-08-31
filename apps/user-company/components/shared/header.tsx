"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { ChevronLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { refineTitle, resolveHeader } from "@/lib/header-config"
import { SiteMenu } from "@/components/shared/site-menu"
import { ROUTES } from "@/lib/routes"

function BrandMark({ withText = true }: { withText?: boolean }) {
  return (
    <Image
      src={withText ? "/images/logo-with-text.png" : "/images/logo.png"}
      alt="MyKaggo"
      width={withText ? 600 : 425}
      height={withText ? 171 : 512}
      className="h-9 w-auto shrink-0 object-contain"
      priority
    />
  )
}

export default function Header() {
  const pathname = usePathname() ?? "/"
  const router = useRouter()

  const { variant, title, showBack } = refineTitle(
    pathname,
    resolveHeader(pathname)
  )

  if (variant === "none") return null

  if (variant === "home") {
    return (
      <header className="z-10 flex shrink-0 items-center justify-between border-b border-border/40 bg-background px-6 py-3.5">
        <BrandMark />
        <div className="flex shrink-0 items-center gap-2">
          <Button
            render={<Link href={ROUTES.riderIdentify} />}
            nativeButton={false}
            className="h-9 rounded-[8px] px-5 text-sm font-semibold shadow-none"
          >
            List item
          </Button>
          <SiteMenu />
        </div>
      </header>
    )
  }

  if (variant === "company-home") {
    return (
      <header className="z-10 flex shrink-0 items-center justify-between border-b border-border/40 bg-background px-6 py-3.5">
        <BrandMark />
        <div className="flex shrink-0 items-center gap-2">
          <Button
            render={<Link href={ROUTES.companyLogin} />}
            nativeButton={false}
            className="h-9 rounded-[8px] px-6 text-sm font-semibold shadow-none"
          >
            Login
          </Button>
          <SiteMenu />
        </div>
      </header>
    )
  }

  return (
    <header className="relative flex h-14 shrink-0 items-center justify-center border-b border-border/40 bg-background px-4">
      {showBack ? (
        <button
          type="button"
          onClick={() => router.back()}
          className="absolute left-4 -ml-2 p-2 text-foreground transition-opacity active:opacity-70"
          aria-label="Go back"
        >
          <ChevronLeft className="size-6 stroke-[1.5]" />
        </button>
      ) : null}
      <h1 className="truncate text-[17px] font-medium text-foreground">
        {title}
      </h1>
    </header>
  )
}
