"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { ChevronLeft, LogOut, Settings } from "lucide-react"

import { adminLogoutAction } from "@/app/actions"
import { Button } from "@/components/ui/button"
import { refineTitle, resolveHeader } from "@/lib/header-config"
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

  if (variant === "admin") {
    return (
      <header className="z-10 flex shrink-0 items-center gap-3 bg-background px-5 pt-8 pb-4">
        <BrandMark withText={false} />
        <h1 className="ml-1 flex-1 truncate text-xl font-medium text-foreground">
          {title ?? "Dashboard"}
        </h1>

        <Button
          render={<Link href={ROUTES.adminSettings} />}
          nativeButton={false}
          variant="ghost"
          size="icon"
          aria-label="Settings"
          className="shrink-0"
        >
          <Settings />
        </Button>

        <form action={adminLogoutAction} className="shrink-0">
          <Button type="submit" variant="ghost" size="icon" aria-label="Sign out">
            <LogOut />
          </Button>
        </form>
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
