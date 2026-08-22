"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"

export default function Header() {
  const pathname = usePathname()
  const router = useRouter()

  // Default configuration
  let variant = "inner"
  let title = ""
  let showBack = true

  // Route specific configuration
  if (pathname === "/") {
    variant = "home"
  } else if (pathname === "/company") {
    variant = "company-home"
  } else if (pathname?.startsWith("/dashboard")) {
    variant = "dashboard"
  } else if (pathname === "/company/dashboard") {
    title = "Dashboard"
    showBack = false
  } else if (pathname === "/company/register") {
    title = "Create Account"
    showBack = false
  } else if (pathname === "/company/login") {
    title = "Login"
    showBack = false
  } else if (
    pathname === "/company/submitted" ||
    pathname === "/company/batches/assign-driver/success" ||
    pathname === "/company/vehicles/onboarding/success" ||
    pathname === "/onboarding/success"
  ) {
    return null // No header for success screens
  } else if (pathname === "/company/batches") {
    title = "Batch Manager"
    showBack = true
  } else if (pathname === "/company/batches/create") {
    title = "Create New Batch"
    showBack = true
  } else if (
    pathname?.startsWith("/company/batches") &&
    pathname?.endsWith("/packages")
  ) {
    title = "Package List"
    showBack = true
  } else if (pathname === "/company/batches/assign-driver") {
    title = "Assign Driver"
    showBack = true
  } else if (pathname === "/company/vehicles") {
    title = "Vehicles"
    showBack = true
  } else if (pathname === "/company/vehicles/onboarding") {
    title = "Vehicle Onboarding"
    showBack = true
  } else if (pathname === "/track") {
    title = "Track Item"
  } else if (pathname === "/list-item") {
    title = "List Item"
  } else if (pathname === "/onboarding" || pathname === "/onboarding/info") {
    title = "Kaggo Vehicle Onboarding"
    showBack = false
  } else {
    // Fallback for any other path: format the first path segment
    const pathSegment = pathname?.split("/")[1] || ""
    title =
      pathSegment.charAt(0).toUpperCase() +
      pathSegment.slice(1).replace(/-/g, " ")
  }

  if (variant === "home") {
    return (
      <header className="z-10 flex shrink-0 items-center justify-between px-6 py-4">
        <Image
          src="/images/logo-with-text.png"
          alt="MyKaggo"
          width={600}
          height={171}
          className="h-9 w-auto object-contain"
          priority
        />
        <Button
          render={<Link href="/list-item" />}
          nativeButton={false}
          className="rounded-md px-5 text-sm font-medium shadow-none"
        >
          List item
        </Button>
      </header>
    )
  }

  if (variant === "company-home") {
    return (
      <header className="z-10 flex shrink-0 items-center justify-between bg-background px-6 py-4">
        <Image
          src="/images/logo-with-text.png"
          alt="MyKaggo"
          width={600}
          height={171}
          className="h-9 w-auto object-contain"
          priority
        />
        <Button
          render={<Link href="/company/login" />}
          nativeButton={false}
          className="rounded-md bg-[#008967] px-6 text-sm font-medium text-white shadow-none hover:bg-[#007558]"
        >
          Login
        </Button>
      </header>
    )
  }

  if (variant === "dashboard") {
    return (
      <header className="z-10 flex shrink-0 items-center justify-between gap-4 bg-background px-5 pt-8 pb-4">
        <Image
          src="/images/logo.png"
          alt="Kaggo"
          width={425}
          height={512}
          className="h-9 w-auto shrink-0 object-contain"
          priority
        />
        <h1 className="ml-2 text-xl font-medium text-foreground">Dashboard</h1>
      </header>
    )
  }

  return (
    <header className="relative flex h-14 shrink-0 items-center justify-center border-b border-border/40 bg-background px-4">
      {showBack && (
        <button
          onClick={() => router.back()}
          className="absolute left-4 -ml-2 p-2 text-foreground transition-opacity active:opacity-70"
          aria-label="Go back"
        >
          <ChevronLeft className="size-6 stroke-[1.5]" />
        </button>
      )}
      <h1 className="text-[17px] font-medium text-foreground">{title}</h1>
    </header>
  )
}
