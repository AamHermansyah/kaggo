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
  } else if (pathname?.startsWith("/dashboard")) {
    variant = "dashboard"
  } else if (pathname === "/track") {
    title = "Track Item"
  } else if (pathname === "/list-item") {
    title = "List Item"
  } else if (pathname === "/onboarding" || pathname === "/onboarding/info") {
    title = "Kaggo Vehicle Onboarding"
    showBack = false
  } else if (pathname === "/onboarding/success") {
    return null // No header for success page
  } else {
    // Fallback for any other path: format the first path segment
    const pathSegment = pathname?.split('/')[1] || ""
    title = pathSegment.charAt(0).toUpperCase() + pathSegment.slice(1).replace(/-/g, ' ')
  }

  if (variant === "home") {
    return (
      <header className="flex items-center justify-between px-6 py-4 z-10 shrink-0">
        <Image 
          src="/images/kaggo-by-rovasoft.png" 
          alt="Kaggo By Rovasoft" 
          width={100} 
          height={40} 
          className="h-9 w-auto object-contain"
          priority
        />
        <Button render={<Link href="/list-item" />} nativeButton={false} className="rounded-md px-5 shadow-none font-medium text-sm">
          List item
        </Button>
      </header>
    )
  }

  if (variant === "dashboard") {
    return (
      <header className="flex items-center gap-4 px-5 pt-8 pb-4 z-10 shrink-0 bg-background">
        <Image 
          src="/images/kaggo-by-rovasoft.png" 
          alt="Kaggo By Rovasoft" 
          width={100} 
          height={40} 
          className="h-9 w-auto object-contain shrink-0"
          priority
        />
        <h1 className="text-[22px] font-medium text-foreground ml-2">Dashboard</h1>
      </header>
    )
  }

  return (
    <header className="flex items-center justify-center px-4 h-14 border-b border-border/40 shrink-0 relative bg-background">
      {showBack && (
        <button 
          onClick={() => router.back()} 
          className="absolute left-4 p-2 -ml-2 text-foreground active:opacity-70 transition-opacity"
          aria-label="Go back"
        >
          <ChevronLeft className="w-6 h-6 stroke-[1.5]" />
        </button>
      )}
      <h1 className="text-[17px] font-medium text-foreground">
        {title}
      </h1>
    </header>
  )
}
